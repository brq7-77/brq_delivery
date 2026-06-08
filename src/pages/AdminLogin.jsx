import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useLanguage } from "../i18n/LanguageContext";
import toast from "react-hot-toast";

export default function AdminLogin({ onLogin, onBack }) {
  const { t } = useLanguage();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    const { data, error } = await supabase
      .from("supervisors")
      .select("*");

    if (error) {
      toast.error(t.databaseError);
      return;
    }

    const userRow = data?.find(
      (u) =>
        u.active === true &&
        (u.username === cleanIdentifier || u.email === cleanIdentifier) &&
        u.password === cleanPassword
    );

    if (!userRow) {
      toast.error(t.wrongLogin);
      return;
    }

    const user = {
      id: userRow.id,
      name: userRow.name,
      username: userRow.username,
      email: userRow.email,
      role: userRow.role,
      active: userRow.active,
    };

    localStorage.setItem("brq_admin_token", "supabase-local-token");
    localStorage.setItem("brq_admin_user", JSON.stringify(user));

    toast.success(t.welcomeBack);
    onLogin(user);
  }

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="login-icon">
          <i className="fa-solid fa-shield-halved"></i>
        </div>

        <p className="eyebrow">BRQ Control Center</p>
        <h1>{t.adminLogin}</h1>

        <label>
          {t.emailOrUsername}
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="baraa or admin@brq.delivery"
          />
        </label>

        <label>
          {t.password}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>

        <button type="submit">
          <i className="fa-solid fa-right-to-bracket"></i>
          {t.login}
        </button>

        <button type="button" className="login-back" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i>
          {t.backToStore}
        </button>
      </form>
    </main>
  );
}