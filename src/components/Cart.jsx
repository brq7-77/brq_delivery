import { useLanguage } from "../i18n/LanguageContext";

export default function Cart({
  open,
  items,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
}) {
  const { t } = useLanguage();

  const subtotal = items.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.qty || 1),
    0
  );

  const delivery = items.length > 0 ? 2.5 : 0;
  const total = subtotal + delivery;

  return (
    <>
      <div className={`cart-overlay ${open ? "show" : ""}`} onClick={onClose}></div>

      <aside className={`cart-panel ${open ? "show" : ""}`}>
        <div className="cart-head">
          <div>
            <p className="eyebrow">{t.yourOrder}</p>
            <h2>{t.cart}</h2>
          </div>

          <button onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">
              <i className="fa-solid fa-bag-shopping"></i>
              <h3>{t.emptyCartTitle}</h3>
              <p>{t.emptyCartText}</p>
            </div>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={item.id}>
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="cart-placeholder">
                    <i className="fa-solid fa-utensils"></i>
                  </div>
                )}

                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>${Number(item.price || 0).toFixed(2)}</p>

                  <div className="qty-row">
                    <button onClick={() => onDecrease(item.id)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => onIncrease(item.id)}>+</button>
                  </div>
                </div>

                <button className="remove-btn" onClick={() => onRemove(item.id)}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary">
          <div>
            <span>{t.subtotal}</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>

          <div>
            <span>{t.delivery}</span>
            <strong>${delivery.toFixed(2)}</strong>
          </div>

          <div className="total-row">
            <span>{t.total}</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <button
            className="checkout-btn"
            disabled={items.length === 0}
            onClick={onCheckout}
          >
            {t.checkout} <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </aside>
    </>
  );
}