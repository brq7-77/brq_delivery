export default function AdminOrders({ orders = [], onUpdateStatus }) {
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
          {orders.map((order) => {
            const customerName = order.customerName || order.customer?.name || "Unknown";
            const phone = order.phone || order.customer?.phone || "No phone";
            const address = order.address || order.customer?.address || "No address";
            const payment = order.payment || order.customer?.payment || "cash";

            return (
              <article className="order-card" key={order.id}>
                <div className="order-top">
                  <div>
                    <h3>{customerName}</h3>
                    <p>{phone}</p>
                  </div>

                  <span className={`status ${(order.status || "pending").replaceAll(" ", "-")}`}>
                    {order.status || "pending"}
                  </span>
                </div>

                <div className="order-info">
                  <p><i className="fa-solid fa-location-dot"></i>{address}</p>
                  <p><i className="fa-solid fa-money-bill"></i>${Number(order.total || 0).toFixed(2)}</p>
                  <p><i className="fa-solid fa-credit-card"></i>{payment}</p>
                </div>

                <div className="order-items">
                  {(order.items || []).map((item, index) => (
                    <div key={item.id || index}>
                      <span>{item.name}</span>
                      <strong>x{item.qty || 1}</strong>
                    </div>
                  ))}
                </div>

                <select
                  value={order.status || "pending"}
                  onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}