export default function Deals() {
  const deals = [
    {
      icon: "fa-truck-fast",
      title: "Free Delivery",
      text: "On orders above $25",
    },
    {
      icon: "fa-burger",
      title: "20% Off Burgers",
      text: "Limited BRQ weekend deal",
    },
    {
      icon: "fa-utensils",
      title: "Combo Meal",
      text: "Burger + fries + drink",
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