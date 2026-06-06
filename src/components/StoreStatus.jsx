export default function StoreStatus({ orderType, onChangeOrderType }) {
  return (
    <section className="store-status">
      <div className="status-card open">
        <i className="fa-solid fa-store"></i>
        <div>
          <span>Status</span>
          <strong>Open Now</strong>
        </div>
      </div>

      <div className="status-card">
        <i className="fa-solid fa-clock"></i>
        <div>
          <span>{orderType === "delivery" ? "Delivery Time" : "Pickup Time"}</span>
          <strong>{orderType === "delivery" ? "25-35 min" : "10-15 min"}</strong>
        </div>
      </div>

      <div className="status-card">
        <i className="fa-solid fa-basket-shopping"></i>
        <div>
          <span>Minimum Order</span>
          <strong>$5.00</strong>
        </div>
      </div>

      <div className="delivery-toggle">
        <button
          className={orderType === "delivery" ? "active" : ""}
          onClick={() => onChangeOrderType("delivery")}
        >
          <i className="fa-solid fa-motorcycle"></i>
          Delivery
        </button>

        <button
          className={orderType === "pickup" ? "active" : ""}
          onClick={() => onChangeOrderType("pickup")}
        >
          <i className="fa-solid fa-bag-shopping"></i>
          Pickup
        </button>
      </div>
    </section>
  );
}