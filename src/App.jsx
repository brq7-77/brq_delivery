import { useEffect, useMemo, useState } from "react";
import { categories } from "./data/menu";
import toast from "react-hot-toast";
import { notifyError } from "./utils/notify";
import Header from "./components/Header";
import Hero from "./components/Hero";
import CategoryBar from "./components/CategoryBar";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import ProductModal from "./components/ProductModal";
import Checkout from "./components/Checkout";
import Admin from "./pages/Admin";
import TrackingModal from "./components/TrackingModal";
import StoreStatus from "./components/StoreStatus";
import Deals from "./components/Deals";
import AdminLogin from "./pages/AdminLogin";
import RestaurantsSection from "./components/RestaurantsSection";
import { getRestaurants } from "./api";
import { useLanguage } from "./i18n/LanguageContext";

import {
  createOrder,
  getOrders,
  updateOrderStatusApi,
  trackVisitor,
  getProducts,
} from "./api";

export default function App() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [pageMode, setPageMode] = useState("home");
  const [orders, setOrders] = useState([]);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [latestOrder, setLatestOrder] = useState(null);
  const [orderType, setOrderType] = useState("delivery");
  const [products, setProducts] = useState([]);
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem("brq_admin_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    async function loadData() {
        const ordersData = await getOrders();
        const productsData = await getProducts();
        const restaurantsData = await getRestaurants();

        if (ordersData.success) {
        setOrders(ordersData.orders);
        }

        if (productsData.success) {
        setProducts(productsData.products.filter((item) => item.active));
        }

        if (restaurantsData.success) {
        setRestaurants(restaurantsData.restaurants.filter((item) => item.active));
        }
    }

    loadData();
    trackVisitor(window.location.pathname);
  }, []);

  const filteredItems = useMemo(() => {
    return products.filter((item) => {
        const matchRestaurant =
        selectedRestaurant && item.restaurantId === selectedRestaurant.id;

        const matchCategory =
        activeCategory === "All" || item.category === activeCategory;

        const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

        return matchRestaurant && matchCategory && matchSearch;
    });
  }, [activeCategory, search, products, selectedRestaurant]);

  function addToCart(item) {
    setCart((prev) => {
      const exists = prev.find((cartItem) => cartItem.id === item.id);

      if (exists) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
      }

      return [...prev, { ...item, qty: 1 }];
    });

    setCartOpen(true);
  }

  function increaseQty(id) {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item))
    );
  }

  function decreaseQty(id) {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0)
    );
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  async function placeOrder(order) {
    const data = await createOrder(order);

    if (!data.success) {
        toast.error(t.failedPlaceOrder);
        return;
    }

    const newOrder = data.order;

    setOrders((prev) => [newOrder, ...prev]);
    setLatestOrder(newOrder);

    toast.success(t.orderPlacedSuccess);

    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
    setTrackingOpen(true);
  }

  async function updateOrderStatus(orderId, status) {
    const data = await updateOrderStatusApi(orderId, status);

    if (data.success) {
      setOrders(data.orders);

      setLatestOrder((prev) =>
        prev && prev.id === orderId ? { ...prev, status } : prev
      );
    }
  }

  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  if (pageMode === "admin" && !adminUser) {
    return (
        <div className="app">
        <AdminLogin
            onLogin={setAdminUser}
            onBack={() => setPageMode("home")}
        />
        </div>
    );
    }

    if (pageMode === "admin" && adminUser) {
    return (
        <div className="app">
        <Admin
            orders={orders}
                onBack={() => {
                    localStorage.removeItem("brq_admin_token");
                    localStorage.removeItem("brq_admin_user");

                    setAdminUser(null);
                    setPageMode("home");
                }}
              adminUser={adminUser}
                    onLogout={() => {
                    localStorage.removeItem("brq_admin_token");
                    localStorage.removeItem("brq_admin_user");
                    setAdminUser(null);
                    setPageMode("home");
                }}
            onUpdateStatus={updateOrderStatus}
        />
        </div>
    );
  }

  return (
    <div className="app">
      <Header
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onAdminClick={() => setPageMode("admin")}
        onTrackClick={() => {
            if (latestOrder) {
                setTrackingOpen(true);
            } else {
                notifyError(t.noOrderToTrack);
            }
        }}
      />

      <main className="page">
        <Hero onOrderNow={() => {
            document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
        }} />
        <StoreStatus orderType={orderType} onChangeOrderType={setOrderType} />
        <Deals />

        <RestaurantsSection
            restaurants={restaurants}
            onOpenRestaurant={(restaurant) => {
                setSelectedRestaurant(restaurant);
                document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
            }}
        />

        <section className="menu-section" id="menu">
          <div className="section-head">
            <div>
              <p className="eyebrow">{t.exploreMenu}</p>
              <h2>{selectedRestaurant ? selectedRestaurant.name : t.selectRestaurant}</h2>
            </div>
            <span>{filteredItems.length} {t.items}</span>
          </div>

          {selectedRestaurant && (
            <button
                className="back-restaurants-btn"
                onClick={() => setSelectedRestaurant(null)}
            >
                <i className="fa-solid fa-arrow-left"></i>
                {t.backToRestaurants}
            </button>
          )}

          <CategoryBar
            categories={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />

          <div className="search-row">
            <div className="search-box">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
            </div>
          </div>

          {!selectedRestaurant ? (
            <div className="empty-menu-state">
                <i className="fa-solid fa-store"></i>
                <h3>{t.selectRestaurantFirst}</h3>
                <p>{t.chooseRestaurantToViewMenu}</p>
            </div>
            ) : (
            <div className="products-grid">
                {filteredItems.map((item) => (
                <ProductCard
                    key={item.id}
                    item={item}
                    onAdd={addToCart}
                    onOpen={setSelectedItem}
                />
                ))}
            </div>
          )}

        </section>
      </main>

      <Cart
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onIncrease={increaseQty}
        onDecrease={decreaseQty}
        onRemove={removeFromCart}
        onCheckout={() => setCheckoutOpen(true)}
      />

      <ProductModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAdd={addToCart}
      />

      <Checkout
        open={checkoutOpen}
        items={cart}
        orderType={orderType}
        onClose={() => setCheckoutOpen(false)}
        onOrderPlaced={placeOrder}
      />

      <TrackingModal
        open={trackingOpen}
        order={latestOrder}
        onClose={() => setTrackingOpen(false)}
      />
    </div>
  );
}