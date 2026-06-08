import { useLanguage } from "../i18n/LanguageContext";

export default function Deals() {
  const { t } = useLanguage();

  const deals = [
    {
      icon: "fa-truck-fast",
      title: t.freeDelivery,
      text: t.onOrdersAbove,
    },
    {
      icon: "fa-burger",
      title: t.offBurgers,
      text: t.limitedDeal,
    },
    {
      icon: "fa-utensils",
      title: t.comboMeal,
      text: t.comboText,
    },
  ];

  return (
    <section className="deals-section">
      {deals.map((deal) => (
        <article className="deal-card" key={deal.title}>
          <i className={`fa-solid ${deal.icon}`}></i>

          <div>
            <h3>{deal.title}</h3>
            <p>{deal.text}</p>
          </div>
        </article>
      ))}
    </section>
  );
}