export default function RestaurantCard({ restaurant, onOpen }) {
  return (
    <article className="restaurant-card" onClick={() => onOpen(restaurant)}>
      <img src={restaurant.image} alt={restaurant.name} />

      <div className="restaurant-card-content">
        <div>
          <h3>{restaurant.name}</h3>
          <p>{restaurant.description}</p>
        </div>

        <div className="restaurant-meta">
          <span>
            <i className="fa-solid fa-star"></i>
            {Number(restaurant.rating).toFixed(1)}
          </span>

          <span>
            <i className="fa-solid fa-clock"></i>
            {restaurant.deliveryTime}
          </span>

          <span>
            <i className="fa-solid fa-layer-group"></i>
            {restaurant.category}
          </span>
        </div>
      </div>
    </article>
  );
}