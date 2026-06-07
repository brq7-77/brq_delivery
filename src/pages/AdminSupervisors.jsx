import { useEffect, useState } from "react";
import { notifyError, notifySuccess, notifyPrime } from "../utils/notify";
import {
  createSupervisor,
  deleteSupervisor,
  getSupervisors,
  updateSupervisor,
} from "../api";

import ConfirmModal from "../components/ConfirmModal";

const emptyForm = {
  name: "",
  username: "",
  email: "",
  password: "",
  role: "Supervisor",
};

export default function AdminSupervisors() {
  const [supervisors, setSupervisors] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadSupervisors();
  }, []);

  async function loadSupervisors() {
    const data = await getSupervisors();
    if (data.success) setSupervisors(data.supervisors);
  }

  function openCreateForm() {
    setEditingUser(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEditForm(user) {
    setEditingUser(user);
    setForm({
        name: user.name,
        username: user.username || "",
        email: user.email,
        password: user.password || "",
        role: user.role,
    });
    setFormOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.email) {
      notifyError("Please fill name, username, and email.");
      return;
    }

    const data = editingUser
      ? await updateSupervisor(editingUser.id, form)
      : await createSupervisor(form);

    if (data.success) {
      setSupervisors(data.supervisors);
      setFormOpen(false);
      setEditingUser(null);
      setForm(emptyForm);
    }
  }

  async function toggleUser(user) {
    const data = await updateSupervisor(user.id, {
      active: !user.active,
    });

    if (data.success) setSupervisors(data.supervisors);
    notifySuccess("Supervisor saved successfully");
  }

  async function removeUser(id) {
    const data = await deleteSupervisor(id);

    if (data.success) {
        setSupervisors(data.supervisors);
        setDeleteTarget(null);
        notifySuccess("Supervisor deleted successfully");
    }
  }

  return (
    <div className="admin-view">
      <div className="admin-view-head">
        <div>
          <p className="eyebrow">Team</p>
          <h1>Supervisors</h1>
        </div>

        <button className="admin-action-btn" onClick={openCreateForm}>
          <i className="fa-solid fa-user-plus"></i>
          Add Supervisor
        </button>
      </div>

      {formOpen && (
        <form className="admin-product-form" onSubmit={handleSubmit}>
          <div className="form-title">
            <h2>
              <i className="fa-solid fa-user-shield"></i>
              {editingUser ? "Edit Supervisor" : "Add Supervisor"}
            </h2>

            <button type="button" onClick={() => setFormOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="admin-form-grid">
            <label>
              Full Name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Baraa Admin"
              />
            </label>

            <label>
                Username
                <input
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    placeholder="baraa"
                />
            </label>

            <label>
              Email
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@brq.delivery"
              />
            </label>

            <label>
                Password
                <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="******"
                />
            </label>

            <label className="full">
              Role
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option>Owner</option>
                <option>Manager</option>
                <option>Supervisor</option>
                <option>Support</option>
              </select>
            </label>
          </div>

          <button className="save-product-btn" type="submit">
            <i className="fa-solid fa-floppy-disk"></i>
            Save Supervisor
          </button>
        </form>
      )}

      <div className="supervisors-grid">
        {supervisors.map((user) => (
          <article
            className={`supervisor-card ${!user.active ? "disabled" : ""}`}
            key={user.id}
          >
            <div className="supervisor-icon">
              <i className="fa-solid fa-user-tie"></i>
            </div>

            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p><i className="fa-solid fa-at"></i>{user.username || "No username"}</p>
            <p>{user.role}</p>

            <span className={user.active ? "active-user" : "disabled-user"}>
              <i
                className={`fa-solid ${
                  user.active ? "fa-circle-check" : "fa-circle-xmark"
                }`}
              ></i>
              {user.active ? "Active" : "Disabled"}
            </span>

            <div className="supervisor-actions">
              <button onClick={() => openEditForm(user)}>
                <i className="fa-solid fa-pen"></i>
              </button>

              <button onClick={() => toggleUser(user)}>
                <i className={`fa-solid ${user.active ? "fa-eye" : "fa-eye-slash"}`}></i>
              </button>

              <button onClick={() => setDeleteTarget(user)}>
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </article>
        ))}
      </div>
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Supervisor?"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => removeUser(deleteTarget.id)}
      />
    </div>
  );
}