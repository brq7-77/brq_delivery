import { canAccess } from "../utils/permissions";

export default function AdminSidebar({ activePage, onChangePage, onBack, user, open }) {  const links = [
    { id: "dashboard", label: "Dashboard", icon: "fa-chart-line" },
    { id: "orders", label: "Orders", icon: "fa-receipt" },
    { id: "visitors", label: "Visitors", icon: "fa-shield-halved" },
    { id: "restaurants", label: "Restaurants", icon: "fa-store" },
    { id: "products", label: "Products", icon: "fa-burger" },
    { id: "coupons", label: "Coupons", icon: "fa-ticket" },
    { id: "supervisors", label: "Supervisors", icon: "fa-user-tie" },
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
        Back to Store
      </button>
    </aside>
  );
}