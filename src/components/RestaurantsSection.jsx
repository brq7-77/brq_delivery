import RestaurantCard from "./RestaurantCard";

export default function RestaurantsSection({ restaurants, onOpenRestaurant }) {
  return (
    <section className="restaurants-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Restaurants</p>
          <h2>Choose restaurant</h2>
        </div>

        <span>{restaurants.length} restaurants</span>
      </div>

      <div className="restaurants-grid">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onOpen={onOpenRestaurant}
          />
        ))}
      </div>
    </section>
  );
}