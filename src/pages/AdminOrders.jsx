import { useLanguage } from "../i18n/LanguageContext";

export default function AdminOrders({ orders = [], onUpdateStatus }) {
  const { t } = useLanguage();

  const statuses = ["pending", "preparing", "on the way", "delivered"];

  const statusLabels = {
    pending: t.pending,
    preparing: t.preparing,
    "on the way": t.onTheWay,
    delivered: t.delivered,
  };

  return (
    <div className="admin-view">
      <div className="admin-view-head">
        <div>
          <p className="eyebrow">{t.orders}</p>
          <h1>{t.ordersManagement}</h1>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty">
          <i className="fa-solid fa-receipt"></i>
          <h2>{t.noOrdersYet}</h2>
          <p>{t.newOrdersAppearHere}</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => {
            const customerName =
              order.customerName || order.customer?.name || t.unknownCustomer;

            const phone = order.phone || order.customer?.phone || t.noPhone;
            const address = order.address || order.customer?.address || t.noAddress;
            const payment = order.payment || order.customer?.payment || t.cash;
            const status = order.status || "pending";

            return (
              <article className="order-card" key={order.id}>
                <div className="order-top">
                  <div>
                    <h3>{customerName}</h3>
                    <p>{phone}</p>
                  </div>

                  <span className={`status ${status.replaceAll(" ", "-")}`}>
                    {statusLabels[status] || status}
                  </span>
                </div>

                <div className="order-info">
                  <p>
                    <i className="fa-solid fa-location-dot"></i>
                    {address}
                  </p>

                  <p>
                    <i className="fa-solid fa-money-bill"></i>
                    ${Number(order.total || 0).toFixed(2)}
                  </p>

                  <p>
                    <i className="fa-solid fa-credit-card"></i>
                    {payment}
                  </p>
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
                  value={status}
                  onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                >
                  {statuses.map((statusOption) => (
                    <option key={statusOption} value={statusOption}>
                      {statusLabels[statusOption] || statusOption}
                    </option>
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