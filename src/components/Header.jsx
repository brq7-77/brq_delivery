export default function Header({ cartCount, onCartClick, onAdminClick, onTrackClick }) {  return (
    <header className="header">
      <div className="brand">
        <div className="brand-icon">
          <i className="fa-solid fa-bolt"></i>
        </div>
        <div>
          <h1>BRQ Delivery</h1>
          <p>Fast food delivery system</p>
        </div>
      </div>

      <nav className="nav">
        <button className="nav-link" onClick={onTrackClick}>
          <i className="fa-solid fa-route"></i>
          Track
        </button>

        <button className="cart-button" onClick={onCartClick}>
          <i className="fa-solid fa-bag-shopping"></i>
          {cartCount > 0 && <span>{cartCount}</span>}
        </button>

        <button className="nav-link" onClick={onAdminClick}>
          Admin
        </button>
      </nav>
    </header>
  );
}