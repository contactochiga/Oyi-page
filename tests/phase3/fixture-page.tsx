// TEST ONLY — temporarily re-exported by a local review route, never shipped.
import StoryCarousel from "@/components/hardware/StoryCarousel";
import {
  HardwareBrowser,
  type StoreCard,
} from "@/components/hardware/HardwareBrowser";
import "@/components/hardware/hardware.css";
const cards: StoreCard[] = Array.from({ length: 14 }, (_, i) => ({
  slug: `test-fixture-${i + 1}`,
  name: `TEST FIXTURE ${String(i + 1).padStart(2, "0")}`,
  model: "TEST ONLY",
  summary: "Isolated layout test, not a product offer.",
  category: {
    slug: i % 2 ? "test-a" : "test-b",
    name: i % 2 ? "Test category A" : "Test category B",
  },
  brand: null,
  price_from_kobo: null,
  price_to_kobo: null,
  availability: i % 2 ? "available_to_order" : "in_stock",
  cover: null,
  updated_at: null,
  image: "",
  priceLabel: "",
  availabilityLabel: i % 2 ? "Available to order" : "In stock",
}));
export default function FixturePage() {
  return (
    <main className="hw-store">
      <p
        role="note"
        style={{ background: "#ffecb3", padding: 12, color: "#302000" }}
      >
        LOCAL INTERACTION FIXTURES — no real products or prices
      </p>
      <StoryCarousel
        ariaLabel="Test stories"
        slides={[
          {
            key: "a",
            eyebrow: "TEST ONLY",
            title: "Story A",
            description: "Playback, pause and swipe verification.",
            ctaLabel: "Browse test fixtures",
            ctaHref: "#browse",
            durationMs: 20000,
          },
          {
            key: "b",
            eyebrow: "TEST ONLY",
            title: "Story B",
            description: "Second story, not commercial content.",
            ctaLabel: "Browse test fixtures",
            ctaHref: "#browse",
            durationMs: 20000,
          },
        ]}
      />
      <div className="hw-container">
        <HardwareBrowser products={cards} initialCategory="" />
      </div>
    </main>
  );
}
