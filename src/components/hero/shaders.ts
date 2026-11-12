/**
 * GPU shaders for the hero scene.
 *
 * Hair: every strand is a thin ribbon. Its shape (a flowing cubic curve),
 * wind motion and pointer response are all computed on the GPU, so the CPU
 * does almost no work per frame. Lighting uses the Kajiya–Kay hair model,
 * which produces the characteristic sliding highlight along real hair.
 */

export const hairVertex = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  uniform vec2  uMouse;
  uniform float uMouseStrength;
  uniform float uWidthScale;

  attribute float aT;      // 0 at root → 1 at tip
  attribute float aSide;   // -1 / +1 across the ribbon
  attribute vec4  aSeed;   // xy: spread (-1..1), z: phase (0..1), w: brightness (0..1)
  attribute float aWidth;

  varying float vT;
  varying float vSide;
  varying float vBright;
  varying float vVis;
  varying vec3  vTangent;
  varying vec3  vViewDir;

  vec3 bez(vec3 a, vec3 b, vec3 c, vec3 d, float t) {
    float u = 1.0 - t;
    return u*u*u*a + 3.0*u*u*t*b + 3.0*u*t*t*c + t*t*t*d;
  }

  vec3 strandPos(float t) {
    float ph = aSeed.z * 6.28318;
    // Wide S-shaped lock entering from the right edge
    vec3 p0 = vec3(4.5, 0.95, -0.6) + vec3(aSeed.x * 0.25, aSeed.y * 0.22, aSeed.y * 0.40);
    vec3 p1 = vec3(0.3, 1.55, 0.6)  + vec3(aSeed.x * 0.70, aSeed.y * 0.45, aSeed.x * 0.55);
    vec3 p2 = vec3(3.9, -0.5, -0.5) + vec3(aSeed.y * 0.80, aSeed.x * 0.55, aSeed.y * 0.60);
    vec3 p3 = vec3(1.3, -2.9, 0.4)  + vec3(aSeed.x * 1.30, aSeed.y * 0.45, aSeed.x * 0.85);
    vec3 p = bez(p0, p1, p2, p3, t);

    float tip = t * t;
    float w1 = sin(t * 5.0  - uTime * 0.80 + ph) * 0.12;
    float w2 = sin(t * 11.0 - uTime * 1.45 + ph * 1.7) * 0.035;
    float sway = sin(uTime * 0.35 + aSeed.x * 0.6) * 0.28;
    p.x += (w1 + w2) * (0.25 + t) + sway * tip;
    p.z += cos(t * 4.0 - uTime * 0.6 + ph) * 0.16 * t;
    p.y += sin(uTime * 0.5 + ph) * 0.05 * tip;
    return p;
  }

  void main() {
    float len = 0.72 + 0.28 * fract(aSeed.z * 7.13 + aSeed.w * 3.1);
    float t = aT * len;
    vec3 p  = strandPos(t);
    vec3 pn = strandPos(min(t + 0.01, 1.0));
    vec3 pp = strandPos(max(t - 0.01, 0.0));

    vec4 world = modelMatrix * vec4(p, 1.0);
    vec3 tangent = normalize((modelMatrix * vec4(pn - pp, 0.0)).xyz);

    // Pointer: strands part softly around the cursor / finger
    vec2 d = world.xy - uMouse;
    float fall = exp(-dot(d, d) * 1.8);
    world.xy += normalize(d + 1e-4) * fall * uMouseStrength * (0.25 + t);
    world.z  += fall * uMouseStrength * 0.35;

    vec3 viewDir = normalize(cameraPosition - world.xyz);
    vec3 side = normalize(cross(tangent, viewDir));
    float width = aWidth * uWidthScale * (1.0 - 0.75 * aT);
    world.xyz += side * aSide * width;

    // Entrance: strands grow from root to tip
    float r = uReveal * 1.35 - aSeed.z * 0.35;
    vVis = 1.0 - smoothstep(r - 0.12, r, aT);

    vT = aT;
    vSide = aSide;
    vBright = aSeed.w;
    vTangent = tangent;
    vViewDir = viewDir;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const hairFragment = /* glsl */ `
  uniform vec3  uLightDir;
  uniform vec3  uBase;
  uniform vec3  uGold;
  uniform vec3  uGoldSoft;
  uniform float uOpacity;

  varying float vT;
  varying float vSide;
  varying float vBright;
  varying float vVis;
  varying vec3  vTangent;
  varying vec3  vViewDir;

  void main() {
    vec3 T = normalize(vTangent);
    vec3 V = normalize(vViewDir);
    vec3 L = normalize(uLightDir);
    vec3 H = normalize(L + V);

    // Kajiya–Kay: primary (sharp, warm white-gold) + secondary (broad, gold) lobes
    float th  = dot(T, H);
    float s1  = pow(sqrt(max(0.0, 1.0 - th * th)), 110.0);
    float th2 = th + 0.14;
    float s2  = pow(sqrt(max(0.0, 1.0 - th2 * th2)), 22.0);
    float tl  = dot(T, L);
    float diff = sqrt(max(0.0, 1.0 - tl * tl));

    vec3 col = uBase * (0.35 + 0.65 * diff) * (0.6 + 0.9 * vBright);
    col += uGoldSoft * s1 * (0.55 + 1.1 * vBright);
    col += uGold * s2 * 0.32;

    float edge = 1.0 - smoothstep(0.3, 1.0, abs(vSide));
    float ends = smoothstep(0.0, 0.07, vT) * (1.0 - smoothstep(0.72, 1.0, vT));
    float a = edge * ends * vVis * uOpacity * (0.42 + 0.58 * vBright);
    if (a < 0.003) discard;
    gl_FragColor = vec4(col, a);
  }
`;

export const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uReveal;
  attribute vec4 aSeed; // x: size, y: speed, z: phase, w: brightness
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float h = 6.5;
    p.y = mod(p.y + uTime * (0.04 + aSeed.y * 0.1) + h * 0.5, h) - h * 0.5;
    p.x += sin(uTime * 0.3 + aSeed.z * 6.28318) * 0.18;
    p.z += cos(uTime * 0.25 + aSeed.z * 6.28318) * 0.12;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = mix(1.6, 10.0, aSeed.x * aSeed.x * aSeed.x);
    gl_PointSize = size * uPixelRatio * (5.0 / -mv.z);

    float twinkle = 0.55 + 0.45 * sin(uTime * (0.7 + aSeed.y) + aSeed.z * 20.0);
    float edgeFade = 1.0 - smoothstep(h * 0.32, h * 0.5, abs(p.y));
    vAlpha = twinkle * (0.25 + 0.75 * aSeed.w) * edgeFade * uReveal;
  }
`;

export const dustFragment = /* glsl */ `
  uniform vec3 uGold;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(uGold, a * vAlpha * 0.85);
  }
`;
