import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function Driver({
  orders = [],
  onUpdateStatus,
  onBack,
}) {
    const previousOrdersCount = useRef(orders.length);

    useEffect(() => {
    if (orders.length > previousOrdersCount.current) {
        toast.success("New delivery order received!");

        const audio = new Audio(
        "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
        );

        audio.volume = 0.5;
        audio.play().catch(() => {});
    }

    previousOrdersCount.current = orders.length;
    }, [orders.length]);

  const driverOrders = orders.filter(
    (order) =>
      order.status === "pending" ||
      order.status === "preparing" ||
      order.status === "on the way"
  );

  return (
    <div className="driver-page">

      <div className="driver-header">
        <h1>Driver Panel</h1>

        <button onClick={onBack}>
          Back
        </button>
      </div>

      {driverOrders.map((order) => (
        <div className="driver-card" key={order.id}>
            <h3>
                {order.customerName || order.customer?.name || "Unknown Customer"}
            </h3>

            <p>
                <i className="fa-solid fa-location-dot"> </i>
                {order.address || order.customer?.address || "No Address"}
            </p>

            <p>
                <i className="fa-solid fa-phone"> </i>
                {order.phone || order.customer?.phone || "No Phone"}
            </p>

            <a
                href={`tel:${order.phone || order.customer?.phone}`}
                className="driver-call-btn"
                >
                <i className="fa-solid fa-phone"></i>
                Call Customer
            </a>

            <div className="driver-items">
                <h4>
                    <i className="fa-solid fa-bag-shopping"></i>
                    Order Items
                </h4>

                {(order.items || []).map((item, index) => (
                    <div className="driver-item-row" key={item.id || index}>
                    <span>{item.name}</span>
                    <strong>x{item.qty || 1}</strong>
                    </div>
                ))}
                </div>

                <div className="driver-extra-info">
                <p>
                    <i className="fa-solid fa-credit-card"></i>
                    {order.payment || order.customer?.payment || "Cash"}
                </p>

                <p>
                    <i className="fa-solid fa-note-sticky"></i>
                    {order.note || order.notes || order.customer?.notes || "No notes"}
                </p>
            </div>

            <strong>
                ${Number(order.total || 0).toFixed(2)}
            </strong>

            <div className="driver-actions">
                <button
                onClick={() =>
                    onUpdateStatus(order.id, "preparing")
                }
                >
                Preparing
                </button>

                <button
                onClick={() =>
                    onUpdateStatus(order.id, "on the way")
                }
                >
                On The Way
                </button>

                <button
                onClick={() =>
                    onUpdateStatus(order.id, "delivered")
                }
                >
                Delivered
                </button>
            </div>
        </div>
      ))}
    </div>
  );
}
