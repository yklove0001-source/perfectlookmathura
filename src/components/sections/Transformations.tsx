import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TransformationViewer } from "@/components/transform/TransformationViewer";
import { getTransformations } from "@/lib/photos";

export async function Transformations() {
  const items = await getTransformations();
  return (
    <section id="transformations" aria-labelledby="tr-title" className="bg-ink py-24 md:py-36">
      <Container>
        <TransformationViewer
          items={items}
          heading={
            <SectionHeading
              eyebrow="The Transformation"
              title={
                <span id="tr-title">
                  Real people. <em className="text-gold-sheen">Real change.</em>
                </span>
              }
              intro="Genuine results from our studio in Mathura. Drag the handle to compare before and after."
            />
          }
        />
      </Container>
    </section>
  );
}
