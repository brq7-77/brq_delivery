import { useState } from "react";
import { validateCoupon } from "../api";
import { useLanguage } from "../i18n/LanguageContext";
import {
  notifyError,
  notifySuccess,
  notifyPrime,
} from "../utils/notify";

export default function Checkout({ open, items, orderType, onClose, onOrderPlaced }) {
  const { t } = useLanguage();

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
      notifyError(t.enterCouponCode);
      return;
    }

    const data = await validateCoupon(couponCode, subtotal, delivery);

    if (!data.success) {
      notifyError(data.message || t.invalidCoupon);
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
    notifySuccess(t.couponApplied);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submitOrder(e) {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address) {
      notifyPrime(t.fillRequiredFields);
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
            <p className="eyebrow">{t.checkout}</p>
            <h2>{t.completeOrder}</h2>
          </div>

          <button onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form className="checkout-body" onSubmit={submitOrder}>
          <div className="checkout-form">
            <label>
              {t.fullName}
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t.enterYourName}
              />
            </label>

            <label>
              {t.phoneNumber}
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="05xxxxxxxx"
              />
            </label>

            <label>
              {t.deliveryAddress}
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder={t.addressPlaceholder}
              />
            </label>

            <label>
              {t.notes}
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder={t.notesPlaceholder}
              />
            </label>

            <div className="payment-box">
              <p>{t.paymentMethod}</p>

              <div className="payment-options">
                <button
                  type="button"
                  className={form.payment === "cash" ? "active" : ""}
                  onClick={() => setForm({ ...form, payment: "cash" })}
                >
                  <i className="fa-solid fa-money-bill"></i>
                  {t.cash}
                </button>

                <button
                  type="button"
                  className={form.payment === "card" ? "active" : ""}
                  onClick={() => setForm({ ...form, payment: "card" })}
                >
                  <i className="fa-solid fa-credit-card"></i>
                  {t.card}
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
                <p>{t.yourDriver}</p>
                <h4>Michael Jordan</h4>

                <span>
                  <i className="fa-solid fa-motorcycle"></i>
                  {t.arrivingIn}
                </span>
              </div>
            </div>

            <h3>{t.orderSummary}</h3>

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
                placeholder={t.promoCode}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              />

              <button type="button" onClick={applyCoupon}>
                {t.apply}
              </button>
            </div>

            {appliedCoupon && (
              <div className="coupon-applied">
                <i className="fa-solid fa-ticket"></i>
                {appliedCoupon.code} {t.applied}
              </div>
            )}

            <div className="checkout-totals">
              <div>
                <span>{t.subtotal}</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>

              <div>
                <span>{t.delivery}</span>
                <strong>${delivery.toFixed(2)}</strong>
              </div>

              <div>
                <span>{t.taxes}</span>
                <strong>${taxes.toFixed(2)}</strong>
              </div>

              {safeDiscount > 0 && (
                <div>
                  <span>{t.discount}</span>
                  <strong>-${safeDiscount.toFixed(2)}</strong>
                </div>
              )}

              <div className="total-row">
                <span>{t.total}</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>

            <button className="place-order-btn" type="submit">
              {t.placeOrder} <i className="fa-solid fa-check"></i>
            </button>

            <div className="secure-note">
              <i className="fa-solid fa-shield"></i>
              {t.secureCheckout}
            </div>
          </aside>
        </form>
      </section>
    </>
  );
}