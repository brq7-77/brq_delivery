export default function Hero({ onOrderNow }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="eyebrow">Modern food ordering</p>
        <h1>Order food with a clean modern experience.</h1>
        <p>
          Choose your meal, add it to your cart, and enjoy a fast BRQ styled
          delivery experience.
        </p>

        <div className="hero-actions">
          <button onClick={onOrderNow}>
            Order Now <i className="fa-solid fa-arrow-right"></i>
          </button>

          <span>
            <i className="fa-solid fa-clock"></i>
            Delivery in 25-35 min
          </span>
        </div>
      </div>

      <div className="hero-card">
        <img
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=800"
          alt="Burger"
        />
        <div className="floating-badge">
          <i className="fa-solid fa-star"></i>
          4.9 Rating
        </div>
      </div>
    </section>
  );
}