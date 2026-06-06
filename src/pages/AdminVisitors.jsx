import { useEffect, useState } from "react";
import { getVisitors } from "../api";

export default function AdminVisitors() {
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
          <p className="eyebrow">Security</p>
          <h1>Visitors Logs</h1>
        </div>
      </div>

      <div className="security-note">
        <i className="fa-solid fa-shield-halved"></i>

        <span>
          Real visitor logs collected from the backend system.
        </span>
      </div>

      {visitors.length === 0 ? (
        <div className="admin-empty">
          <i className="fa-solid fa-user-shield"></i>
          <h2>No visitors yet</h2>
          <p>Visitors will appear here automatically.</p>
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