import { useLanguage } from "../i18n/LanguageContext";

export default function StoreStatus({ orderType, onChangeOrderType }) {
  const { t } = useLanguage();

  return (
    <section className="store-status">
      <div className="status-card open">
        <i className="fa-solid fa-store"></i>
        <div>
          <span>{t.status}</span>
          <strong>{t.openNow}</strong>
        </div>
      </div>

      <div className="status-card">
        <i className="fa-solid fa-clock"></i>
        <div>
          <span>
            {orderType === "delivery"
              ? t.deliveryTime
              : t.pickupTime}
          </span>

          <strong>
            {orderType === "delivery"
              ? "25-35 min"
              : "10-15 min"}
          </strong>
        </div>
      </div>

      <div className="status-card">
        <i className="fa-solid fa-basket-shopping"></i>
        <div>
          <span>{t.minimumOrder}</span>
          <strong>$5.00</strong>
        </div>
      </div>

      <div className="delivery-toggle">
        <button
          className={orderType === "delivery" ? "active" : ""}
          onClick={() => onChangeOrderType("delivery")}
        >
          <i className="fa-solid fa-motorcycle"></i>
          {t.delivery}
        </button>

        <button
          className={orderType === "pickup" ? "active" : ""}
          onClick={() => onChangeOrderType("pickup")}
        >
          <i className="fa-solid fa-bag-shopping"></i>
          {t.pickup}
        </button>
      </div>
    </section>
  );
}