import { useState } from "react";
import { canAccess } from "../utils/permissions";
import AdminSidebar from "../components/AdminSidebar";
import AdminDashboard from "./AdminDashboard";
import AdminOrders from "./AdminOrders";
import AdminVisitors from "./AdminVisitors";
import AdminProducts from "./AdminProducts";
import AdminSupervisors from "./AdminSupervisors";
import AdminTopbar from "../components/AdminTopbar";
import AdminRestaurants from "./AdminRestaurants";
import AdminCoupons from "./AdminCoupons";

export default function Admin({ orders, onBack, onUpdateStatus, adminUser, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="admin-shell">
      <button
        className="admin-mobile-menu-btn"
        onClick={() => setSidebarOpen(true)}
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <AdminSidebar
        activePage={activePage}
        onChangePage={(page) => {
          setActivePage(page);
          setSidebarOpen(false);
        }}
        onBack={onBack}
        user={adminUser}
        open={sidebarOpen}
      />

      <section className="admin-content">
        <AdminTopbar user={adminUser} onLogout={onLogout} />
        {activePage === "dashboard" && <AdminDashboard orders={orders} />}
        {activePage === "orders" && canAccess(adminUser, "orders") && (
          <AdminOrders orders={orders} onUpdateStatus={onUpdateStatus} />
        )}
        {activePage === "visitors" && canAccess(adminUser, "visitors") && <AdminVisitors />}
        {activePage === "restaurants" && canAccess(adminUser, "restaurants") && (
          <AdminRestaurants />
        )}
        {activePage === "products" && canAccess(adminUser, "products") && <AdminProducts />}
        {activePage === "coupons" && canAccess(adminUser, "coupons") && <AdminCoupons />}
        {activePage === "supervisors" && canAccess(adminUser, "supervisors") && <AdminSupervisors />}
      </section>
    </main>
  );
}