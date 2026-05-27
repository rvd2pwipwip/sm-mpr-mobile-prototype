import "./HomeBanner.css";

/**
 * Marketing / promo banner — art from `public/bannerMockImage.png` (swap file or `src` as needed).
 */
export default function HomeBanner() {
  return (
    <section className="home-banner" aria-label="Promotional banner">
      <img
        className="home-banner__image"
        src="/bannerMockImage.png"
        alt=""
        width={1200}
        height={400}
        decoding="async"
      />
    </section>
  );
}
