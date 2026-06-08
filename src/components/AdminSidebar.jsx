import { canAccess } from "../utils/permissions";
import { useLanguage } from "../i18n/LanguageContext";

export default function AdminSidebar({
  activePage,
  onChangePage,
  onBack,
  user,
  open,
}) {
  const { t } = useLanguage();

  const links = [
    { id: "dashboard", label: t.dashboard || "Dashboard", icon: "fa-chart-line" },
    { id: "orders", label: t.orders || "Orders", icon: "fa-receipt" },
    { id: "visitors", label: t.visitors || "Visitors", icon: "fa-shield-halved" },
    { id: "restaurants", label: t.restaurants || "Restaurants", icon: "fa-store" },
    { id: "products", label: t.products || "Products", icon: "fa-burger" },
    { id: "coupons", label: t.coupons || "Coupons", icon: "fa-ticket" },
    { id: "supervisors", label: t.supervisors || "Supervisors", icon: "fa-user-tie" },
  ];

  return (
    <aside className={`admin-sidebar ${open ? "open" : ""}`}>
      <div className="admin-brand">
        <div className="brand-icon">
          <i className="fa-solid fa-bolt"></i>
        </div>

        <div>
          <h2>BRQ Admin</h2>
          <p>Control Center</p>
        </div>
      </div>

      <nav className="admin-nav">
        {links
          .filter((link) => canAccess(user, link.id))
          .map((link) => (
            <button
              key={link.id}
              className={activePage === link.id ? "active" : ""}
              onClick={() => onChangePage(link.id)}
            >
              <i className={`fa-solid ${link.icon}`}></i>
              {link.label}
            </button>
          ))}
      </nav>

      <button className="admin-back-btn" onClick={onBack}>
        <i className="fa-solid fa-arrow-left"></i>
        {t.backToStore}
      </button>
    </aside>
  );
}