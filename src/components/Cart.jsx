export default function Cart({
  open,
  items,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
}) {
  const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);
  const delivery = items.length > 0 ? 2.5 : 0;
  const total = subtotal + delivery;

  return (
    <>
      <div className={`cart-overlay ${open ? "show" : ""}`} onClick={onClose}></div>

      <aside className={`cart-panel ${open ? "show" : ""}`}>
        <div className="cart-head">
          <div>
            <p className="eyebrow">Your Order</p>
            <h2>Cart</h2>
          </div>
          <button onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">
              <i className="fa-solid fa-bag-shopping"></i>
              <h3>Your cart is empty</h3>
              <p>Add meals to start your order.</p>
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
                  <p>${item.price.toFixed(2)}</p>

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
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <div>
            <span>Delivery</span>
            <strong>${delivery.toFixed(2)}</strong>
          </div>
          <div className="total-row">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <button
            className="checkout-btn"
            disabled={items.length === 0}
            onClick={onCheckout}
            >
            Checkout <i className="fa-solid fa-arrow-right"></i>
            </button>
        </div>
      </aside>
    </>
  );
}