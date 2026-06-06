export default function AdminTopbar({ user, onLogout }) {
  return (
    <header className="admin-topbar">
      <div>
        <p className="eyebrow">Secure Session</p>
        <h2>
          <i className="fa-solid fa-user-shield"></i>
          {user?.name || "Admin"}
        </h2>
      </div>

      <div className="admin-session-box">
        <span className="role-badge">
          <i className="fa-solid fa-crown"></i>
          {user?.role || "Supervisor"}
        </span>

        <span className="online-badge">
          <i className="fa-solid fa-circle"></i>
          Online
        </span>

        <button onClick={onLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          Logout
        </button>
      </div>
    </header>
  );
}