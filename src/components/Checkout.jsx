import { useState } from "react";
import { validateCoupon } from "../api";
import {
  notifyError,
  notifySuccess,
  notifyPrime,
} from "../utils/notify";

export default function Checkout({ open, items, orderType, onClose, onOrderPlaced }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    payment: "cash",
    notes: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  if (!open) return null;

  const subtotal = items.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.qty || 1),
    0
  );

  const delivery = items.length > 0 && orderType === "delivery" ? 2.5 : 0;
  const taxes = items.length > 0 ? 1.2 : 0;
  const safeDiscount = Number(discount || 0);
  const total = Math.max(0, subtotal + delivery + taxes - safeDiscount);

  async function applyCoupon() {
    if (!couponCode.trim()) {
      notifyError("Please enter coupon code.");
      return;
    }

    const data = await validateCoupon(couponCode, subtotal, delivery);

    if (!data.success) {
      notifyError(data.message || "Invalid coupon.");
      setAppliedCoupon(null);
      setDiscount(0);
      return;
    }

    const coupon = data.coupon;
    let calculatedDiscount = 0;

    if (coupon.type === "percent") {
      calculatedDiscount = subtotal * (Number(coupon.value || 0) / 100);
    } else if (coupon.type === "fixed") {
      calculatedDiscount = Number(coupon.value || 0);
    } else if (coupon.type === "free_delivery") {
      calculatedDiscount = delivery;
    }

    setAppliedCoupon(coupon);
    setDiscount(calculatedDiscount);
    notifySuccess("Coupon applied successfully");
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submitOrder(e) {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address) {
      notifyPrime("Please fill name, phone, and address.");
      return;
    }

    onOrderPlaced({
      customer: form,
      items,
      orderType,
      subtotal,
      delivery,
      taxes,
      total,
      coupon: appliedCoupon,
      discount: safeDiscount,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <>
      <div className="checkout-overlay" onClick={onClose}></div>

      <section className="checkout-modal">
        <div className="checkout-head">
          <div>
            <p className="eyebrow">Checkout</p>
            <h2>Complete your order</h2>
          </div>

          <button onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form className="checkout-body" onSubmit={submitOrder}>
          <div className="checkout-form">
            <label>
              Full Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </label>

            <label>
              Phone Number
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="05xxxxxxxx"
              />
            </label>

            <label>
              Delivery Address
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="City, street, building..."
              />
            </label>

            <label>
              Notes
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Extra sauce, no onions..."
              />
            </label>

            <div className="payment-box">
              <p>Payment Method</p>

              <div className="payment-options">
                <button
                  type="button"
                  className={form.payment === "cash" ? "active" : ""}
                  onClick={() => setForm({ ...form, payment: "cash" })}
                >
                  <i className="fa-solid fa-money-bill"></i>
                  Cash
                </button>

                <button
                  type="button"
                  className={form.payment === "card" ? "active" : ""}
                  onClick={() => setForm({ ...form, payment: "card" })}
                >
                  <i className="fa-solid fa-credit-card"></i>
                  Card
                </button>
              </div>
            </div>
          </div>

          <aside className="checkout-summary">
            <div className="delivery-preview">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300"
                alt="Driver"
              />

              <div>
                <p>Your Driver</p>
                <h4>Michael Jordan</h4>

                <span>
                  <i className="fa-solid fa-motorcycle"></i>
                  Arriving in 25-35 min
                </span>
              </div>
            </div>

            <h3>Order Summary</h3>

            <div className="checkout-items">
              {items.map((item) => (
                <div className="checkout-item" key={item.id}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="checkout-item-placeholder">
                      <i className="fa-solid fa-burger"></i>
                    </div>
                  )}

                  <div>
                    <h4>{item.name}</h4>
                    <p>
                      {item.qty} × ${Number(item.price || 0).toFixed(2)}
                    </p>
                  </div>

                  <strong>
                    ${(Number(item.price || 0) * Number(item.qty || 1)).toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>

            <div className="promo-box">
              <input
                placeholder="Promo code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              />

              <button type="button" onClick={applyCoupon}>
                Apply
              </button>
            </div>

            {appliedCoupon && (
              <div className="coupon-applied">
                <i className="fa-solid fa-ticket"></i>
                {appliedCoupon.code} applied
              </div>
            )}

            <div className="checkout-totals">
              <div>
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>

              <div>
                <span>Delivery</span>
                <strong>${delivery.toFixed(2)}</strong>
              </div>

              <div>
                <span>Taxes</span>
                <strong>${taxes.toFixed(2)}</strong>
              </div>

              {safeDiscount > 0 && (
                <div>
                  <span>Discount</span>
                  <strong>-${safeDiscount.toFixed(2)}</strong>
                </div>
              )}

              <div className="total-row">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>

            <button className="place-order-btn" type="submit">
              Place Order <i className="fa-solid fa-check"></i>
            </button>

            <div className="secure-note">
              <i className="fa-solid fa-shield"></i>
              Secure encrypted checkout
            </div>
          </aside>
        </form>
      </section>
    </>
  );
}