import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getGallery } from "@/lib/photos";

export async function Gallery() {
  const photos = await getGallery();
  return (
    <section id="gallery" aria-labelledby="ga-title" className="bg-ink py-24 md:py-36">
      <Container>
        <SectionHeading
          eyebrow="The Gallery"
          title={
            <span id="ga-title">
              Inside the <em className="text-gold-sheen">studio.</em>
            </span>
          }
        />
        <GalleryGrid photos={photos} />
      </Container>
    </section>
  );
}
