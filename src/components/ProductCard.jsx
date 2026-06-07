export default function ProductCard({ item, onAdd, onOpen }) {
  return (
    <article className="product-card" onClick={() => onOpen(item)}>
      <div className="product-image">
        {item.image ? (
          <img src={item.image} alt={item.name} />
        ) : (
          <div className="product-placeholder">
            <i className="fa-solid fa-burger"></i>
          </div>
        )}
      </div>

      <div className="product-info">
        <div className="product-top">
          <h3>{item.name}</h3>
          <span>
            <i className="fa-solid fa-star"></i>
            {item.rating}
          </span>
        </div>

        <p>{item.description}</p>

        <div className="product-bottom">
          <strong>${item.price.toFixed(2)}</strong>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(item);
            }}
          >
            <i className="fa-solid fa-plus"></i>
            Add
          </button>
        </div>
      </div>
    </article>
  );
}