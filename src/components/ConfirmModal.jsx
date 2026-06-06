export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = true,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <>
      <div className="confirm-overlay" onClick={onCancel}></div>

      <section className="confirm-modal">
        <div className={`confirm-icon ${danger ? "danger" : "prime"}`}>
          <i className={`fa-solid ${danger ? "fa-triangle-exclamation" : "fa-circle-info"}`}></i>
        </div>

        <h2>{title}</h2>
        <p>{message}</p>

        <div className="confirm-actions">
          <button className="confirm-cancel" onClick={onCancel}>
            <i className="fa-solid fa-xmark"> </i>
            {cancelText}
          </button>

          <button
            className={danger ? "confirm-danger" : "confirm-prime"}
            onClick={onConfirm}
          >
            <i className="fa-solid fa-check"> </i>
            {confirmText}
          </button>
        </div>
      </section>
    </>
  );
}