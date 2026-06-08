import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useLanguage } from "../i18n/LanguageContext";

export default function TrackOrder({ onClose }) {
  const { t } = useLanguage();
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  async function handleTrack(e) {
    e.preventDefault();
    setError("");
    setOrder(null);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId.trim())
      .eq("phone", phone.trim())
      .maybeSingle();

    if (error || !data) {
      setError(t.orderNotFound || "Order not found");
      return;
    }

    setOrder(data);
  }

  return (
    <main className="track-page">
      <div className="track-card">
        <button className="track-close" onClick={onClose}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>

        <p className="eyebrow">BRQ Tracking</p>
        <h1>{t.trackYourOrder || "Track Your Order"}</h1>

        <form onSubmit={handleTrack} className="track-form">
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder={t.orderId || "Order ID"}
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t.phoneNumber || "Phone Number"}
          />

          <button type="submit">
            <i className="fa-solid fa-route"></i>
            {t.track || "Track"}
          </button>
        </form>

        {error && <p className="track-error">{error}</p>}

        {order && (
          <div className="track-result">
            <h2>#{order.id.slice(0, 8)}</h2>
            <p>{order.customer_name}</p>
            <strong>${Number(order.total || 0).toFixed(2)}</strong>

            <div className="track-status">
              <span className={`status ${order.status?.replaceAll(" ", "-")}`}>
                {order.status}
              </span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}