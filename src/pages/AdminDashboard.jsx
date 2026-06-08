import { useLanguage } from "../i18n/LanguageContext";

export default function AdminDashboard({ orders = [] }) {
  const { t } = useLanguage();

  const revenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const pending = orders.filter((order) => order.status === "pending").length;
  const preparing = orders.filter((order) => order.status === "preparing").length;
  const onTheWay = orders.filter((order) => order.status === "on the way").length;
  const delivered = orders.filter((order) => order.status === "delivered").length;

  const averageOrder =
    orders.length > 0 ? revenue / orders.length : 0;

  const today = new Date().toDateString();

  const todayOrders = orders.filter((order) => {
    const date = order.createdAt || order.created_at || order.createdAt;
    return date && new Date(date).toDateString() === today;
  });

  const todayRevenue = todayOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const cards = [
    { title: t.totalOrders || "Total Orders", value: orders.length, icon: "fa-receipt" },
    { title: t.revenue || "Revenue", value: `$${revenue.toFixed(2)}`, icon: "fa-dollar-sign" },
    { title: t.todayRevenue || "Today Revenue", value: `$${todayRevenue.toFixed(2)}`, icon: "fa-calendar-day" },
    { title: t.averageOrder || "Average Order", value: `$${averageOrder.toFixed(2)}`, icon: "fa-chart-line" },
  ];

  const statusCards = [
    { title: t.pending || "Pending", value: pending, icon: "fa-clock", className: "pending" },
    { title: t.preparing || "Preparing", value: preparing, icon: "fa-fire-burner", className: "preparing" },
    { title: t.onTheWay || "On The Way", value: onTheWay, icon: "fa-motorcycle", className: "on-the-way" },
    { title: t.delivered || "Delivered", value: delivered, icon: "fa-circle-check", className: "delivered" },
  ];

  return (
    <div className="admin-view">
      <div className="admin-view-head">
        <div>
          <p className="eyebrow">{t.overview || "Overview"}</p>
          <h1>{t.dashboard || "Dashboard"}</h1>
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

      <div className="dashboard-status-grid">
        {statusCards.map((card) => (
          <article className={`dashboard-status-card ${card.className}`} key={card.title}>
            <i className={`fa-solid ${card.icon}`}></i>

            <div>
              <span>{card.title}</span>
              <strong>{card.value}</strong>
            </div>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="admin-large-card">
          <h2>
            <i className="fa-solid fa-chart-simple"></i>
            {t.latestOrders || "Latest Orders"}
          </h2>

          {orders.length === 0 ? (
            <p className="muted-text">{t.noOrdersYet || "No orders yet."}</p>
          ) : (
            orders.slice(0, 6).map((order) => (
              <div className="admin-row" key={order.id}>
                <span>
                  {order.customerName ||
                    order.customer_name ||
                    order.customer?.name ||
                    t.unknownCustomer ||
                    "Unknown Customer"}
                </span>

                <strong>${Number(order.total || 0).toFixed(2)}</strong>

                <em>{order.status || "pending"}</em>
              </div>
            ))
          )}
        </div>

        <div className="admin-large-card">
          <h2>
            <i className="fa-solid fa-ranking-star"></i>
            {t.quickSummary || "Quick Summary"}
          </h2>

          <div className="summary-list">
            <div>
              <span>{t.todayOrders || "Today Orders"}</span>
              <strong>{todayOrders.length}</strong>
            </div>

            <div>
              <span>{t.activeOrders || "Active Orders"}</span>
              <strong>{pending + preparing + onTheWay}</strong>
            </div>

            <div>
              <span>{t.completedOrders || "Completed Orders"}</span>
              <strong>{delivered}</strong>
            </div>

            <div>
              <span>{t.totalRevenue || "Total Revenue"}</span>
              <strong>${revenue.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}