export default function TrackingModal({ open, order, onClose }) {
  if (!open || !order) return null;

  const steps = [
    { key: "pending", label: "Order Received", icon: "fa-receipt" },
    { key: "preparing", label: "Preparing", icon: "fa-kitchen-set" },
    { key: "on the way", label: "On The Way", icon: "fa-motorcycle" },
    { key: "delivered", label: "Delivered", icon: "fa-circle-check" },
  ];

  const currentIndex = steps.findIndex((step) => step.key === order.status);

  return (
    <>
      <div className="tracking-overlay" onClick={onClose}></div>

      <section className="tracking-modal">
        <button className="tracking-close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="tracking-hero">
          <div className="tracking-icon">
            <i className="fa-solid fa-location-dot"></i>
          </div>

          <p className="eyebrow">Live Tracking</p>
          <h2>Order #{order.id.slice(0, 8)}</h2>
          <span>{order.status}</span>
        </div>

        <div className="tracking-driver">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300"
            alt="Driver"
          />

          <div>
            <p>Your Driver</p>
            <h3>Michael Jordan</h3>
            <span>
              <i className="fa-solid fa-motorcycle"></i>
              25-35 min remaining
            </span>
          </div>
        </div>

        <div className="tracking-steps">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={`tracking-step ${
                index <= currentIndex ? "active" : ""
              }`}
            >
              <div>
                <i className={`fa-solid ${step.icon}`}></i>
              </div>
              <span>{step.label}</span>
            </div>
          ))}
        </div>

        <div className="tracking-map">
          <i className="fa-solid fa-map-location-dot"></i>
          <p>Driver is heading to your address</p>
        </div>
      </section>
    </>
  );
}