import { useEffect, useMemo, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import {
  createRestaurant,
  deleteRestaurant,
  getRestaurants,
  updateRestaurant,
} from "../api";
import { notifyError, notifyPrime, notifySuccess } from "../utils/notify";

const emptyForm = {
  name: "",
  category: "Burgers",
  rating: "4.5",
  deliveryTime: "25-35 min",
  image: "",
  description: "",
};

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    loadRestaurants();
  }, []);

  async function loadRestaurants() {
    const data = await getRestaurants();
    if (data.success) setRestaurants(data.restaurants);
  }

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchCategory = category === "All" || item.category === category;

      return matchSearch && matchCategory;
    });
  }, [restaurants, search, category]);

  function openCreateForm() {
    setEditingRestaurant(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEditForm(restaurant) {
    setEditingRestaurant(restaurant);
    setForm({
      name: restaurant.name,
      category: restaurant.category,
      rating: restaurant.rating,
      deliveryTime: restaurant.deliveryTime,
      image: restaurant.image,
      description: restaurant.description,
    });
    setFormOpen(true);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.image || !form.description) {
      notifyError("Please fill restaurant name, image, and description.");
      return;
    }

    const data = editingRestaurant
      ? await updateRestaurant(editingRestaurant.id, form)
      : await createRestaurant(form);

    if (data.success) {
      setRestaurants(data.restaurants);
      setFormOpen(false);
      setEditingRestaurant(null);
      setForm(emptyForm);
      notifySuccess("Restaurant saved successfully");
    }
  }

  async function toggleRestaurant(restaurant) {
    const data = await updateRestaurant(restaurant.id, {
      active: !restaurant.active,
    });

    if (data.success) {
      setRestaurants(data.restaurants);
      notifyPrime("Restaurant status updated");
    }
  }

  async function removeRestaurant(id) {
    const data = await deleteRestaurant(id);

    if (data.success) {
      setRestaurants(data.restaurants);
      setDeleteTarget(null);
      notifySuccess("Restaurant deleted successfully");
    }
  }

  return (
    <div className="admin-view products-control-view">
      <div className="admin-view-head products-head">
        <div>
          <p className="eyebrow">Restaurants</p>
          <h1>Restaurants</h1>
        </div>

        <button className="admin-action-btn add-product-main" onClick={openCreateForm}>
          <i className="fa-solid fa-plus"></i>
          Add Restaurant
        </button>
      </div>

      <div className="products-admin-layout">
        <section className="products-main-area">
          <div className="products-tools">
            <div className="products-search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurants..."
              />
            </div>

            <div className="products-filter">
              <i className="fa-solid fa-layer-group"></i>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>All</option>
                <option>Burgers</option>
                <option>Pizza</option>
                <option>Chicken</option>
                <option>Drinks</option>
                <option>Desserts</option>
              </select>
            </div>
          </div>

          {formOpen && (
            <form className="admin-product-form" onSubmit={handleSubmit}>
              <div className="form-title">
                <h2>
                  <i className="fa-solid fa-store"></i>
                  {editingRestaurant ? "Edit Restaurant" : "Add New Restaurant"}
                </h2>

                <button type="button" onClick={() => setFormOpen(false)}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div className="admin-form-grid">
                <label>
                  Restaurant Name
                  <input name="name" value={form.name} onChange={handleChange} />
                </label>

                <label>
                  Category
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option>Burgers</option>
                    <option>Pizza</option>
                    <option>Chicken</option>
                    <option>Drinks</option>
                    <option>Desserts</option>
                  </select>
                </label>

                <label>
                  Rating
                  <input name="rating" value={form.rating} onChange={handleChange} />
                </label>

                <label>
                  Delivery Time
                  <input
                    name="deliveryTime"
                    value={form.deliveryTime}
                    onChange={handleChange}
                    placeholder="25-35 min"
                  />
                </label>

                <label className="full">
                  Image URL
                  <input name="image" value={form.image} onChange={handleChange} />
                </label>

                <label className="full">
                  Description
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <button className="save-product-btn" type="submit">
                <i className="fa-solid fa-floppy-disk"></i>
                Save Restaurant
              </button>
            </form>
          )}

          <div className="products-cinematic-grid">
            {filteredRestaurants.map((item) => (
              <article
                className={`product-control-card ${!item.active ? "is-disabled" : ""}`}
                key={item.id}
              >
                <img className="product-control-img" src={item.image} alt={item.name} />

                <div className="product-control-info">
                  <h3>{item.name}</h3>

                  <p>
                    <i className="fa-solid fa-layer-group"></i>
                    {item.category}
                  </p>

                  <strong>
                    <i className="fa-solid fa-clock"></i> {item.deliveryTime}
                  </strong>

                  <span className="product-rating">
                    <i className="fa-solid fa-star"></i>
                    {Number(item.rating).toFixed(1)}
                  </span>

                  <div className={`product-state ${item.active ? "active" : "disabled"}`}>
                    <i className="fa-solid fa-circle"></i>
                    {item.active ? "Active" : "Disabled"}
                  </div>
                </div>

                <div className="product-action-stack">
                  <button className="edit-action" onClick={() => openEditForm(item)}>
                    <i className="fa-solid fa-pen"></i>
                  </button>

                  <button
                    className={item.active ? "view-action" : "hide-action"}
                    onClick={() => toggleRestaurant(item)}
                  >
                    <i className={`fa-solid ${item.active ? "fa-eye" : "fa-eye-slash"}`}></i>
                  </button>

                  <button className="delete-action" onClick={() => setDeleteTarget(item)}>
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="icons-meaning-panel">
          <h2>إدارة المطاعم</h2>

          <div className="meaning-item">
            <div className="meaning-icon edit-action">
              <i className="fa-solid fa-pen"></i>
            </div>
            <div>
              <h3>تعديل</h3>
              <p>تعديل اسم المطعم، التصنيف، الصورة، وقت التوصيل والوصف.</p>
            </div>
          </div>

          <div className="meaning-item">
            <div className="meaning-icon view-action">
              <i className="fa-solid fa-eye"></i>
            </div>
            <div>
              <h3>تفعيل</h3>
              <p>المطعم يظهر للعملاء داخل الموقع.</p>
            </div>
          </div>

          <div className="meaning-item">
            <div className="meaning-icon hide-action">
              <i className="fa-solid fa-eye-slash"></i>
            </div>
            <div>
              <h3>تعطيل</h3>
              <p>إخفاء المطعم من الموقع بدون حذفه.</p>
            </div>
          </div>

          <div className="meaning-item">
            <div className="meaning-icon delete-action">
              <i className="fa-solid fa-trash-can"></i>
            </div>
            <div>
              <h3>حذف</h3>
              <p>حذف المطعم نهائيًا من النظام.</p>
            </div>
          </div>
        </aside>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Restaurant?"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => removeRestaurant(deleteTarget.id)}
      />
    </div>
  );
}