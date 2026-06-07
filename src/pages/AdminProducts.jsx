import { useEffect, useMemo, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getRestaurants,
  updateProduct,
} from "../api";
import { notifyError, notifyPrime, notifySuccess } from "../utils/notify";

const emptyForm = {
  restaurantId: "",
  name: "",
  category: "Burgers",
  price: "",
  rating: "4.5",
  image: "",
  description: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const productsData = await getProducts();
    const restaurantsData = await getRestaurants();

    if (productsData.success) setProducts(productsData.products);
    if (restaurantsData.success) setRestaurants(restaurantsData.restaurants);
  }

  function getRestaurantName(restaurantId) {
    return restaurants.find((restaurant) => restaurant.id === restaurantId)?.name || "No Restaurant";
  }

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        getRestaurantName(item.restaurantId).toLowerCase().includes(search.toLowerCase());

      const matchCategory = category === "All" || item.category === category;

      return matchSearch && matchCategory;
    });
  }, [products, restaurants, search, category]);

  function openCreateForm() {
    setEditingProduct(null);
    setForm(emptyForm);
    setFormOpen(true);
    notifyPrime("Create product mode enabled");
  }

  function openEditForm(product) {
    setEditingProduct(product);
    setForm({
      restaurantId: product.restaurantId || "",
      name: product.name,
      category: product.category,
      price: product.price,
      rating: product.rating,
      image: product.image,
      description: product.description,
    });

    setFormOpen(true);
    notifyPrime(`Editing ${product.name}`);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingProduct(null);
    setForm(emptyForm);
    notifyPrime("Product form closed");
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.restaurantId || !form.name || !form.price || !form.image || !form.description) {
      notifyError("Please select restaurant and fill all required fields.");
      return;
    }

    const data = editingProduct
      ? await updateProduct(editingProduct.id, form)
      : await createProduct(form);

    if (!data.success) {
      notifyError("Failed to save product");
      return;
    }

    setProducts(data.products);
    setFormOpen(false);
    setEditingProduct(null);
    setForm(emptyForm);

    notifySuccess(editingProduct ? "Product updated successfully" : "Product created successfully");
  }

  async function toggleProduct(product) {
    const data = await updateProduct(product.id, {
      active: !product.active,
    });

    if (!data.success) {
      notifyError("Failed to update product status");
      return;
    }

    setProducts(data.products);
    notifyPrime(product.active ? "Product disabled" : "Product enabled");
  }

  async function removeProduct(id) {
    const data = await deleteProduct(id);

    if (!data.success) {
      notifyError("Failed to delete product");
      return;
    }

    setProducts(data.products);
    setDeleteTarget(null);
    notifySuccess("Product deleted successfully");
  }

  return (
    <div className="admin-view products-control-view">
      <div className="admin-view-head products-head">
        <div>
          <p className="eyebrow">Menu</p>
          <h1>Products</h1>
        </div>

        <button className="admin-action-btn add-product-main" onClick={openCreateForm}>
          <i className="fa-solid fa-plus"></i>
          Add Product
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
                placeholder="Search products or restaurants..."
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
                  <i className="fa-solid fa-burger"></i>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>

                <button type="button" onClick={closeForm}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div className="admin-form-grid">
                <label className="full">
                  Restaurant
                  <select name="restaurantId" value={form.restaurantId} onChange={handleChange}>
                    <option value="">Select restaurant</option>

                    {restaurants.map((restaurant) => (
                      <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Product Name
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
                  Price
                  <input name="price" value={form.price} onChange={handleChange} />
                </label>

                <label>
                  Rating
                  <input name="rating" value={form.rating} onChange={handleChange} />
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
                Save Product
              </button>
            </form>
          )}

          <div className="products-cinematic-grid">
            {filteredProducts.map((item) => (
              <article
                className={`product-control-card ${!item.active ? "is-disabled" : ""}`}
                key={item.id}
              >
                {item.image ? (
                  <img
                    className="product-control-img"
                    src={item.image}
                    alt={item.name}
                  />
                ) : (
                  <div className="product-control-img image-placeholder">
                    <i className="fa-solid fa-burger"></i>
                  </div>
                )}

                <div className="product-control-info">
                  <h3>{item.name}</h3>

                  <p>
                    <i className="fa-solid fa-store"></i>
                    {getRestaurantName(item.restaurantId)}
                  </p>

                  <p>
                    <i className="fa-solid fa-layer-group"></i>
                    {item.category}
                  </p>

                  <strong>${Number(item.price).toFixed(2)}</strong>

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
                  <button className="edit-action" onClick={() => openEditForm(item)} title="Edit">
                    <i className="fa-solid fa-pen"></i>
                  </button>

                  <button
                    className={item.active ? "view-action" : "hide-action"}
                    onClick={() => toggleProduct(item)}
                    title={item.active ? "Disable Product" : "Enable Product"}
                  >
                    <i className={`fa-solid ${item.active ? "fa-eye" : "fa-eye-slash"}`}></i>
                  </button>

                  <button
                    className="delete-action"
                    onClick={() => setDeleteTarget(item)}
                    title="Delete"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="products-bottom-info">
            <div className="product-status-guide">
              <h3>حالة المنتج</h3>

              <p>
                <i className="fa-solid fa-circle active-dot"></i>
                Active <span>المنتج مفعّل ويظهر في المتجر</span>
              </p>

              <p>
                <i className="fa-solid fa-circle disabled-dot"></i>
                Disabled <span>المنتج معطّل ولا يظهر في المتجر</span>
              </p>

              <p>
                <i className="fa-solid fa-circle deleted-dot"></i>
                Deleted <span>المنتج محذوف من النظام نهائيًا</span>
              </p>
            </div>

            <div className="product-warning-box">
              <h3>
                <i className="fa-solid fa-circle-info"></i>
                تنبيه
              </h3>
              <p>
                عند تعطيل المنتج لن يتم حذفه، بل سيتم إخفاؤه فقط من المتجر.
                يمكنك تفعيله مرة أخرى في أي وقت.
              </p>
            </div>
          </div>
        </section>

        <aside className="icons-meaning-panel">
          <h2>معاني الأيقونات</h2>

          <div className="meaning-item">
            <div className="meaning-icon edit-action">
              <i className="fa-solid fa-pen"></i>
            </div>
            <div>
              <h3>تعديل</h3>
              <p>يتيح تعديل بيانات المنتج مثل الاسم، السعر، الصورة، إلخ.</p>
            </div>
          </div>

          <div className="meaning-item">
            <div className="meaning-icon view-action">
              <i className="fa-solid fa-eye"></i>
            </div>
            <div>
              <h3>عرض / تفعيل</h3>
              <p>العين الخضراء تعني أن المنتج مفعّل ويظهر للعملاء.</p>
            </div>
          </div>

          <div className="meaning-item">
            <div className="meaning-icon hide-action">
              <i className="fa-solid fa-eye-slash"></i>
            </div>
            <div>
              <h3>إخفاء / تعطيل</h3>
              <p>العين المشطوبة تعني أن المنتج معطّل ولا يظهر للعملاء.</p>
            </div>
          </div>

          <div className="meaning-item">
            <div className="meaning-icon delete-action">
              <i className="fa-solid fa-trash-can"></i>
            </div>
            <div>
              <h3>حذف</h3>
              <p>حذف المنتج نهائيًا من النظام.</p>
            </div>
          </div>
        </aside>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Product?"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => removeProduct(deleteTarget.id)}
      />
    </div>
  );
}