import { useLanguage } from "../i18n/LanguageContext";

export default function AdminTopbar({ user, onLogout }) {
  const { t } = useLanguage();

  return (
    <header className="admin-topbar">
      <div>
        <p className="eyebrow">{t.secureSession}</p>

        <h2>
          <i className="fa-solid fa-user-shield"></i>
          {user?.name || "Admin"}
        </h2>
      </div>

      <div className="admin-session-box">
        <span className="role-badge">
          <i className="fa-solid fa-crown"></i>
          {user?.role || t.supervisors}
        </span>

        <span className="online-badge">
          <i className="fa-solid fa-circle"></i>
          {t.online}
        </span>

        <button onClick={onLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          {t.logout}
        </button>
      </div>
    </header>
  );
}