import { useEffect, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
} from "../api";
import { notifyError, notifyPrime, notifySuccess } from "../utils/notify";

const emptyForm = {
  code: "",
  type: "percent",
  value: "",
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadCoupons();
  }, []);

  async function loadCoupons() {
    const data = await getCoupons();
    if (data.success) setCoupons(data.coupons);
  }

  function openCreateForm() {
    setEditingCoupon(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEditForm(coupon) {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
    });
    setFormOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.code || !form.type) {
      notifyError("Please fill coupon code and type.");
      return;
    }

    if (form.type !== "free_delivery" && form.value === "") {
      notifyError("Please enter coupon value.");
      return;
    }

    const data = editingCoupon
      ? await updateCoupon(editingCoupon.id, form)
      : await createCoupon(form);

    if (!data.success) {
      notifyError(data.message || "Failed to save coupon");
      return;
    }

    setCoupons(data.coupons);
    setFormOpen(false);
    setEditingCoupon(null);
    setForm(emptyForm);
    notifySuccess(editingCoupon ? "Coupon updated successfully" : "Coupon created successfully");
  }

  async function toggleCoupon(coupon) {
    const data = await updateCoupon(coupon.id, {
      active: !coupon.active,
    });

    if (!data.success) {
      notifyError("Failed to update coupon status");
      return;
    }

    setCoupons(data.coupons);
    notifyPrime(coupon.active ? "Coupon disabled" : "Coupon enabled");
  }

  async function removeCoupon(id) {
    const data = await deleteCoupon(id);

    if (!data.success) {
      notifyError("Failed to delete coupon");
      return;
    }

    setCoupons(data.coupons);
    setDeleteTarget(null);
    notifySuccess("Coupon deleted successfully");
  }

  function couponLabel(coupon) {
    if (coupon.type === "percent") return `${coupon.value}% OFF`;
    if (coupon.type === "fixed") return `$${Number(coupon.value).toFixed(2)} OFF`;
    return "FREE DELIVERY";
  }

  return (
    <div className="admin-view products-control-view">
      <div className="admin-view-head products-head">
        <div>
          <p className="eyebrow">Discounts</p>
          <h1>Coupons</h1>
        </div>

        <button className="admin-action-btn add-product-main" onClick={openCreateForm}>
          <i className="fa-solid fa-plus"></i>
          Add Coupon
        </button>
      </div>

      {formOpen && (
        <form className="admin-product-form" onSubmit={handleSubmit}>
          <div className="form-title">
            <h2>
              <i className="fa-solid fa-ticket"></i>
              {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
            </h2>

            <button
              type="button"
              onClick={() => {
                setFormOpen(false);
                setEditingCoupon(null);
                setForm(emptyForm);
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="admin-form-grid">
            <label>
              Coupon Code
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="BRQ20"
              />
            </label>

            <label>
              Type
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="percent">Percent</option>
                <option value="fixed">Fixed Amount</option>
                <option value="free_delivery">Free Delivery</option>
              </select>
            </label>

            <label className="full">
              Value
              <input
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder={form.type === "percent" ? "20" : form.type === "fixed" ? "5" : "0"}
                disabled={form.type === "free_delivery"}
              />
            </label>
          </div>

          <button className="save-product-btn" type="submit">
            <i className="fa-solid fa-floppy-disk"></i>
            Save Coupon
          </button>
        </form>
      )}

      <div className="coupons-grid">
        {coupons.map((coupon) => (
          <article className={`coupon-card ${!coupon.active ? "is-disabled" : ""}`} key={coupon.id}>
            <div className="coupon-icon">
              <i className="fa-solid fa-ticket"></i>
            </div>

            <div className="coupon-info">
              <h3>{coupon.code}</h3>
              <p>{couponLabel(coupon)}</p>

              <div className={`product-state ${coupon.active ? "active" : "disabled"}`}>
                <i className="fa-solid fa-circle"></i>
                {coupon.active ? "Active" : "Disabled"}
              </div>
            </div>

            <div className="product-action-stack">
              <button className="edit-action" onClick={() => openEditForm(coupon)}>
                <i className="fa-solid fa-pen"></i>
              </button>

              <button
                className={coupon.active ? "view-action" : "hide-action"}
                onClick={() => toggleCoupon(coupon)}
              >
                <i className={`fa-solid ${coupon.active ? "fa-eye" : "fa-eye-slash"}`}></i>
              </button>

              <button className="delete-action" onClick={() => setDeleteTarget(coupon)}>
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </article>
        ))}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Coupon?"
        message={`Are you sure you want to delete ${deleteTarget?.code}?`}
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => removeCoupon(deleteTarget.id)}
      />
    </div>
  );
}