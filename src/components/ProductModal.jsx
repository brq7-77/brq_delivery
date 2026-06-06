export default function ProductModal({ item, onClose, onAdd }) {
  if (!item) return null;

  return (
    <>
      <div className="modal-overlay show" onClick={onClose}></div>

      <div className="product-modal">
        <button className="modal-close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="modal-image">
          <img src={item.image} alt={item.name} />
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
              25-35 min
            </span>
          </div>

          <p>{item.description}</p>

          <div className="modal-bottom">
            <strong>${item.price.toFixed(2)}</strong>

            <button
              onClick={() => {
                onAdd(item);
                onClose();
              }}
            >
              <i className="fa-solid fa-plus"></i>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}