import { useEffect, useState } from "react";
import { getVisitors } from "../api";
import { useLanguage } from "../i18n/LanguageContext";

export default function AdminVisitors() {
  const { t } = useLanguage();
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    async function loadVisitors() {
      const data = await getVisitors();

      if (data.success) {
        setVisitors(data.visitors);
      }
    }

    loadVisitors();
  }, []);

  return (
    <div className="admin-view">
      <div className="admin-view-head">
        <div>
          <p className="eyebrow">{t.security}</p>
          <h1>{t.visitorLogs}</h1>
        </div>
      </div>

      <div className="security-note">
        <i className="fa-solid fa-shield-halved"></i>

        <span>
          {t.realVisitorLogs}
        </span>
      </div>

      {visitors.length === 0 ? (
        <div className="admin-empty">
          <i className="fa-solid fa-user-shield"></i>

          <h2>{t.noVisitorsYet}</h2>

          <p>{t.visitorsAppearAutomatically}</p>
        </div>
      ) : (
        <div className="visitors-table">
          {visitors.map((visitor) => (
            <article className="visitor-card" key={visitor.id}>
              <div className="visitor-icon">
                <i className="fa-solid fa-user-secret"></i>
              </div>

              <div className="visitor-info">
                <h3>{visitor.ip}</h3>

                <p>
                  <i className="fa-solid fa-globe"></i>
                  {visitor.browser}
                </p>

                <p>
                  <i className="fa-solid fa-desktop"></i>
                  {visitor.os}
                </p>

                <p>
                  <i className="fa-solid fa-mobile-screen"></i>
                  {visitor.deviceType}
                </p>

                <p>
                  <i className="fa-solid fa-microchip"></i>
                  {visitor.cpu}
                </p>

                <p>
                  <i className="fa-solid fa-language"></i>
                  {visitor.language}
                </p>

                <p>
                  <i className="fa-solid fa-clock"></i>
                  {new Date(visitor.createdAt).toLocaleString()}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}