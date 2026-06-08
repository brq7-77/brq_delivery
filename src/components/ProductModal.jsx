import { useLanguage } from "../i18n/LanguageContext";

export default function ProductModal({ item, onClose, onAdd }) {
  const { t } = useLanguage();

  if (!item) return null;

  return (
    <>
      <div className="modal-overlay show" onClick={onClose}></div>

      <div className="product-modal">
        <button className="modal-close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="modal-image">
          {item.image ? (
            <img src={item.image} alt={item.name} />
          ) : (
            <div className="image-placeholder">
              <i className="fa-solid fa-burger"></i>
            </div>
          )}
        </div>

        <div className="modal-content">
          <p className="eyebrow">{item.category}</p>

          <h2>{item.name}</h2>

          <div className="modal-meta">
            <span>
              <i className="fa-solid fa-star"></i>
              {item.rating}
            </span>

            <span>
              <i className="fa-solid fa-clock"></i>
              {t.deliveryIn}
            </span>
          </div>

          <p>{item.description}</p>

          <div className="modal-bottom">
            <strong>${Number(item.price || 0).toFixed(2)}</strong>

            <button
              onClick={() => {
                onAdd(item);
                onClose();
              }}
            >
              <i className="fa-solid fa-plus"></i>
              {t.addToCart}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}