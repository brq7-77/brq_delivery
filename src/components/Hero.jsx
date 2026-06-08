import { useLanguage } from "../i18n/LanguageContext";

export default function Hero({ onOrderNow }) {
  const { t } = useLanguage();

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="eyebrow">{t.modernFoodOrdering}</p>

        <h1>{t.heroTitle}</h1>

        <p>{t.heroText}</p>

        <div className="hero-actions">
          <button onClick={onOrderNow}>
            {t.orderNow}
            <i className="fa-solid fa-arrow-right"></i>
          </button>

          <span>
            <i className="fa-solid fa-clock"></i>
            {t.deliveryIn}
          </span>
        </div>
      </div>

      <div className="hero-card">
        <img
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=800"
          alt="Burger"
        />

        <div className="floating-badge">
          <i className="fa-solid fa-star"></i>
          4.9 Rating
        </div>
      </div>
    </section>
  );
}