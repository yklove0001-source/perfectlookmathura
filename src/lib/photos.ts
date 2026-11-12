/**
 * Automatic photo discovery (server-only, runs at build time).
 *
 * The owner adds photos by dropping files into folders — no code changes:
 *
 *   public/images/transformations/<any-name>/before.jpg + after.jpg
 *   public/images/gallery/<category-folder>/*.jpg
 *   public/images/services/<service-slug>.jpg
 *
 * Dimensions and tiny blur previews are generated here so photos load smoothly.
 */
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { cacheLife } from "next/cache";
import { business, galleryFolders, services, type GalleryCategory } from "./site";

export type Photo = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  alt: string;
};

export type GalleryPhoto = Photo & { category: GalleryCategory };
export type TransformationPhotos = { label: string; before: Photo; after: Photo };

const PUBLIC_DIR = path.join(process.cwd(), "public");
const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;
const CAMERA_NAME = /^(img|dsc|dcim|pxl|photo|image|whatsapp image|screenshot)[\s_-]?/i;
const SUFFIX = ` — ${business.fullName}`;

async function listImages(relDir: string) {
  try {
    const files = await readdir(path.join(PUBLIC_DIR, relDir));
    return files
      .filter((f) => IMAGE_EXT.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch {
    return [];
  }
}

async function listDirs(relDir: string) {
  try {
    const entries = await readdir(path.join(PUBLIC_DIR, relDir), { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch {
    return [];
  }
}

/** "01-hair-patch_side-view.jpg" → "Hair patch side view" (camera names fall back to a default). */
export function humanize(name: string, fallback: string, titleCase = false) {
  const base = name.replace(/\.[^.]+$/, "");
  if (CAMERA_NAME.test(base)) return fallback;
  const words = base
    .replace(/[-_]+/g, " ")
    .replace(/\b\d+\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!words) return fallback;
  if (titleCase) return words.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  return words.charAt(0).toUpperCase() + words.slice(1).toLowerCase();
}

async function loadPhoto(relPath: string, alt: string): Promise<Photo | null> {
  const abs = path.join(PUBLIC_DIR, relPath);
  try {
    await stat(abs);
    const img = sharp(abs);
    const meta = await img.metadata();
    let { width = 0, height = 0 } = meta;
    // Phone photos are often stored sideways with an EXIF rotation flag
    if ((meta.orientation ?? 1) >= 5) [width, height] = [height, width];
    const blur = await img.rotate().resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
    return {
      src: "/" + relPath.split(path.sep).join("/"),
      width,
      height,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
      alt,
    };
  } catch {
    return null;
  }
}

async function findByBase(relDir: string, baseName: string) {
  const files = await listImages(relDir);
  return files.find((f) => f.replace(/\.[^.]+$/, "").toLowerCase() === baseName);
}

export async function getTransformations(): Promise<TransformationPhotos[]> {
  "use cache";
  cacheLife("max"); // photos only change when the site is rebuilt
  const dirs = await listDirs("images/transformations");
  const out: TransformationPhotos[] = [];
  for (const dir of dirs) {
    const rel = path.join("images/transformations", dir);
    const [b, a] = await Promise.all([findByBase(rel, "before"), findByBase(rel, "after")]);
    if (!b || !a) continue; // a pair is only shown when both photos exist
    const label = humanize(dir, "Transformation", true);
    const [before, after] = await Promise.all([
      loadPhoto(path.join(rel, b), `${label} — before${SUFFIX}`),
      loadPhoto(path.join(rel, a), `${label} — after${SUFFIX}`),
    ]);
    if (before && after) out.push({ label, before, after });
  }
  return out;
}

export async function getGallery(): Promise<GalleryPhoto[]> {
  "use cache";
  cacheLife("max"); // photos only change when the site is rebuilt
  const out: GalleryPhoto[] = [];
  for (const [folder, category] of Object.entries(galleryFolders)) {
    const rel = path.join("images/gallery", folder);
    for (const file of await listImages(rel)) {
      const photo = await loadPhoto(path.join(rel, file), humanize(file, category) + SUFFIX);
      if (photo) out.push({ ...photo, category });
    }
  }
  return out;
}

export async function getServicePhotos(): Promise<Record<string, Photo>> {
  "use cache";
  cacheLife("max"); // photos only change when the site is rebuilt
  const out: Record<string, Photo> = {};
  for (const s of services) {
    const file = await findByBase("images/services", s.slug);
    if (!file) continue;
    const photo = await loadPhoto(path.join("images/services", file), s.imageAlt);
    if (photo) out[s.slug] = photo;
  }
  return out;
}
