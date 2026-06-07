export default function AdminDashboard({ orders = [] }) {
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const pending = orders.filter((order) => order.status === "pending").length;
  const delivered = orders.filter((order) => order.status === "delivered").length;

  const cards = [
    { title: "Total Orders", value: orders.length, icon: "fa-receipt" },
    { title: "Revenue", value: `$${revenue.toFixed(2)}`, icon: "fa-dollar-sign" },
    { title: "Pending", value: pending, icon: "fa-clock" },
    { title: "Delivered", value: delivered, icon: "fa-circle-check" },
  ];

  return (
    <div className="admin-view">
      <div className="admin-view-head">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
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
          Latest Orders
        </h2>

        {orders.length === 0 ? (
          <p className="muted-text">No orders yet.</p>
        ) : (
          orders.slice(0, 5).map((order) => (
            <div className="admin-row" key={order.id}>
              <span>{order.customerName || order.customer?.name || "Unknown Customer"}</span>
              <strong>${Number(order.total || 0).toFixed(2)}</strong>
              <em>{order.status || "pending"}</em>
            </div>
          ))
        )}
      </div>
    </div>
  );
}