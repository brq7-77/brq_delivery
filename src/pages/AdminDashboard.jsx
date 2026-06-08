import { useLanguage } from "../i18n/LanguageContext";

export default function AdminDashboard({ orders = [] }) {
  const { t } = useLanguage();

  const revenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const pending = orders.filter((order) => order.status === "pending").length;
  const delivered = orders.filter((order) => order.status === "delivered").length;

  const cards = [
    { title: t.totalOrders, value: orders.length, icon: "fa-receipt" },
    { title: t.revenue, value: `$${revenue.toFixed(2)}`, icon: "fa-dollar-sign" },
    { title: t.pending, value: pending, icon: "fa-clock" },
    { title: t.delivered, value: delivered, icon: "fa-circle-check" },
  ];

  return (
    <div className="admin-view">
      <div className="admin-view-head">
        <div>
          <p className="eyebrow">{t.overview}</p>
          <h1>{t.dashboard}</h1>
        </div>
      </div>

      <div className="admin-stats">
        {cards.map((card) => (
          <article className="admin-stat-card" key={card.title}>
            <i className={`fa-solid ${card.icon}`}></i>

            <div>
              <span>{card.title}</span>
              <strong>{card.value}</strong>
            </div>
          </article>
        ))}
      </div>

      <div className="admin-large-card">
        <h2>
          <i className="fa-solid fa-chart-simple"></i>
          {t.latestOrders}
        </h2>

        {orders.length === 0 ? (
          <p className="muted-text">{t.noOrdersYet}</p>
        ) : (
          orders.slice(0, 5).map((order) => (
            <div className="admin-row" key={order.id}>
              <span>
                {order.customerName || order.customer?.name || t.unknownCustomer}
              </span>

              <strong>${Number(order.total || 0).toFixed(2)}</strong>

              <em>{order.status || "pending"}</em>
            </div>
          ))
        )}
      </div>
    </div>
  );
}