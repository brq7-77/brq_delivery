export default function AdminOrders({ orders, onUpdateStatus }) {
  const statuses = ["pending", "preparing", "on the way", "delivered"];

  return (
    <div className="admin-view">
      <div className="admin-view-head">
        <div>
          <p className="eyebrow">Orders</p>
          <h1>Orders Management</h1>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty">
          <i className="fa-solid fa-receipt"></i>
          <h2>No orders yet</h2>
          <p>New orders will appear here.</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-top">
                <div>
                  <h3>{order.customer.name}</h3>
                  <p>{order.customer.phone}</p>
                </div>

                <span className={`status ${order.status.replaceAll(" ", "-")}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-info">
                <p>
                  <i className="fa-solid fa-location-dot"></i>
                  {order.customer.address}
                </p>

                <p>
                  <i className="fa-solid fa-money-bill"></i>
                  ${order.total.toFixed(2)}
                </p>

                <p>
                  <i className="fa-solid fa-credit-card"></i>
                  {order.customer.payment}
                </p>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id}>
                    <span>{item.name}</span>
                    <strong>x{item.qty}</strong>
                  </div>
                ))}
              </div>

              <select
                value={order.status}
                onChange={(e) => onUpdateStatus(order.id, e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}