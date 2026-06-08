import { useLanguage } from "../i18n/LanguageContext";

export default function Header({
  cartCount,
  onCartClick,
  onAdminClick,
  onDriverClick,
  onTrackClick,
}) {
  const { language, changeLanguage, t } = useLanguage();

  return (
    <header className="header">
      <div className="brand">
        <div className="brand-icon">
          <i className="fa-solid fa-bolt"></i>
        </div>

        <div>
          <h1>BRQ Delivery</h1>
          <p>{t.brandSubtitle}</p>
        </div>
      </div>

      <nav className="nav">
        <div className="language-switcher">
          <button className={language === "tr" ? "active" : ""} onClick={() => changeLanguage("tr")}>TR</button>
          <button className={language === "en" ? "active" : ""} onClick={() => changeLanguage("en")}>EN</button>
          <button className={language === "ar" ? "active" : ""} onClick={() => changeLanguage("ar")}>AR</button>
        </div>

        <button className="nav-link" onClick={onTrackClick}>
          <i className="fa-solid fa-route"></i>
          {t.track}
        </button>

        <button className="cart-button" onClick={onCartClick}>
          <i className="fa-solid fa-bag-shopping"></i>
          {cartCount > 0 && <span>{cartCount}</span>}
        </button>

        <button
          className="nav-link"
          onClick={onDriverClick}
        >
          <i className="fa-solid fa-motorcycle"></i>
          Driver
        </button>

        <button className="nav-link" onClick={onAdminClick}>
          {t.admin}
        </button>
      </nav>
    </header>
  );
}