import RestaurantCard from "./RestaurantCard";
import { useLanguage } from "../i18n/LanguageContext";

export default function RestaurantsSection({
  restaurants,
  onOpenRestaurant,
}) {
  const { t } = useLanguage();

  return (
    <section className="restaurants-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">{t.restaurants}</p>
          <h2>{t.chooseRestaurant}</h2>
        </div>

        <span>
          {restaurants.length} {t.restaurantCount}
        </span>
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