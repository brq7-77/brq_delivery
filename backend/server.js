import express from "express";
import cors from "cors";
import { UAParser } from "ua-parser-js";
import db from "./database/db.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

function toBoolRow(row) {
  return row ? { ...row, active: !!row.active } : row;
}

function allRestaurants() {
  return db.prepare("SELECT * FROM restaurants ORDER BY createdAt DESC").all().map(toBoolRow);
}

function allProducts() {
  return db.prepare("SELECT * FROM products ORDER BY createdAt DESC").all().map(toBoolRow);
}

function allSupervisors() {
  return db.prepare("SELECT * FROM supervisors ORDER BY createdAt DESC").all().map(toBoolRow);
}

function seedDatabase() {
  const restaurantsCount = db.prepare("SELECT COUNT(*) as count FROM restaurants").get().count;
  const supervisorsCount = db.prepare("SELECT COUNT(*) as count FROM supervisors").get().count;

  if (restaurantsCount === 0) {
    const r1 = crypto.randomUUID();
    const r2 = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO restaurants
      (id, name, category, rating, deliveryTime, image, description, active, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      r1,
      "BRQ Burger House",
      "Burgers",
      4.8,
      "25-35 min",
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=700",
      "Premium burgers, crispy fries, and BRQ special sauce.",
      1,
      now
    );

    db.prepare(`
      INSERT INTO restaurants
      (id, name, category, rating, deliveryTime, image, description, active, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      r2,
      "Purple Slice Pizza",
      "Pizza",
      4.7,
      "30-40 min",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700",
      "Hot pizza, fresh cheese, and rich tomato sauce.",
      1,
      now
    );

    db.prepare(`
      INSERT INTO products
      (id, restaurantId, name, category, price, rating, image, description, active, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      r1,
      "Void Burger",
      "Burgers",
      8.99,
      4.8,
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700",
      "Juicy beef burger with cheese, sauce, and crispy lettuce.",
      1,
      now
    );

    db.prepare(`
      INSERT INTO products
      (id, restaurantId, name, category, price, rating, image, description, active, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      r2,
      "Purple Pizza",
      "Pizza",
      12.5,
      4.7,
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700",
      "Hot pizza with melted cheese and rich tomato sauce.",
      1,
      now
    );
  }

  if (supervisorsCount === 0) {
    db.prepare(`
      INSERT INTO supervisors
      (id, name, username, email, password, role, active, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      "Baraa Admin",
      "baraa",
      "admin@brq.delivery",
      "123456",
      "Owner",
      1,
      new Date().toISOString()
    );
  }
}

seedDatabase();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "BRQ Delivery API is running with SQLite",
  });
});

/* AUTH */
app.post("/api/auth/login", (req, res) => {
  const { identifier, password } = req.body;

  const user = db
    .prepare(`
      SELECT * FROM supervisors
      WHERE active = 1
      AND password = ?
      AND (LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?))
    `)
    .get(password, identifier, identifier);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid username/email or password",
    });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token: `brq-${user.id}-${Date.now()}`,
  });
});

/* RESTAURANTS */
app.get("/api/restaurants", (req, res) => {
  res.json({
    success: true,
    restaurants: allRestaurants(),
  });
});

app.post("/api/restaurants", (req, res) => {
  db.prepare(`
    INSERT INTO restaurants
    (id, name, category, rating, deliveryTime, image, description, active, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    req.body.name,
    req.body.category,
    Number(req.body.rating || 4.5),
    req.body.deliveryTime || "25-35 min",
    req.body.image,
    req.body.description,
    1,
    new Date().toISOString()
  );

  res.json({
    success: true,
    restaurants: allRestaurants(),
  });
});

app.patch("/api/restaurants/:id", (req, res) => {
  const old = db.prepare("SELECT * FROM restaurants WHERE id = ?").get(req.params.id);

  if (!old) {
    return res.status(404).json({ success: false, message: "Restaurant not found" });
  }

  db.prepare(`
    UPDATE restaurants SET
    name = ?,
    category = ?,
    rating = ?,
    deliveryTime = ?,
    image = ?,
    description = ?,
    active = ?
    WHERE id = ?
  `).run(
    req.body.name ?? old.name,
    req.body.category ?? old.category,
    req.body.rating !== undefined ? Number(req.body.rating) : old.rating,
    req.body.deliveryTime ?? old.deliveryTime,
    req.body.image ?? old.image,
    req.body.description ?? old.description,
    req.body.active !== undefined ? Number(!!req.body.active) : old.active,
    req.params.id
  );

  res.json({
    success: true,
    restaurants: allRestaurants(),
  });
});

app.delete("/api/restaurants/:id", (req, res) => {
  db.prepare("DELETE FROM restaurants WHERE id = ?").run(req.params.id);

  res.json({
    success: true,
    restaurants: allRestaurants(),
  });
});

/* PRODUCTS */
app.get("/api/products", (req, res) => {
  res.json({
    success: true,
    products: allProducts(),
  });
});

app.post("/api/products", (req, res) => {
  db.prepare(`
    INSERT INTO products
    (id, restaurantId, name, category, price, rating, image, description, active, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    req.body.restaurantId,
    req.body.name,
    req.body.category,
    Number(req.body.price),
    Number(req.body.rating || 4.5),
    req.body.image,
    req.body.description,
    1,
    new Date().toISOString()
  );

  res.json({
    success: true,
    products: allProducts(),
  });
});

app.patch("/api/products/:id", (req, res) => {
  const old = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);

  if (!old) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  db.prepare(`
    UPDATE products SET
    restaurantId = ?,
    name = ?,
    category = ?,
    price = ?,
    rating = ?,
    image = ?,
    description = ?,
    active = ?
    WHERE id = ?
  `).run(
    req.body.restaurantId ?? old.restaurantId,
    req.body.name ?? old.name,
    req.body.category ?? old.category,
    req.body.price !== undefined ? Number(req.body.price) : old.price,
    req.body.rating !== undefined ? Number(req.body.rating) : old.rating,
    req.body.image ?? old.image,
    req.body.description ?? old.description,
    req.body.active !== undefined ? Number(!!req.body.active) : old.active,
    req.params.id
  );

  res.json({
    success: true,
    products: allProducts(),
  });
});

app.delete("/api/products/:id", (req, res) => {
  db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);

  res.json({
    success: true,
    products: allProducts(),
  });
});

/* SUPERVISORS */
app.get("/api/supervisors", (req, res) => {
  res.json({
    success: true,
    supervisors: allSupervisors(),
  });
});

app.post("/api/supervisors", (req, res) => {
  try {
    db.prepare(`
      INSERT INTO supervisors
      (id, name, username, email, password, role, active, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      req.body.name,
      req.body.username,
      req.body.email,
      req.body.password || "123456",
      req.body.role || "Supervisor",
      1,
      new Date().toISOString()
    );

    res.json({
      success: true,
      supervisors: allSupervisors(),
    });
  } catch {
    res.status(400).json({
      success: false,
      message: "Username or email already exists",
    });
  }
});

app.patch("/api/supervisors/:id", (req, res) => {
  const old = db.prepare("SELECT * FROM supervisors WHERE id = ?").get(req.params.id);

  if (!old) {
    return res.status(404).json({ success: false, message: "Supervisor not found" });
  }

  try {
    db.prepare(`
      UPDATE supervisors SET
      name = ?,
      username = ?,
      email = ?,
      password = ?,
      role = ?,
      active = ?
      WHERE id = ?
    `).run(
      req.body.name ?? old.name,
      req.body.username ?? old.username,
      req.body.email ?? old.email,
      req.body.password ?? old.password,
      req.body.role ?? old.role,
      req.body.active !== undefined ? Number(!!req.body.active) : old.active,
      req.params.id
    );

    res.json({
      success: true,
      supervisors: allSupervisors(),
    });
  } catch {
    res.status(400).json({
      success: false,
      message: "Username or email already exists",
    });
  }
});

app.delete("/api/supervisors/:id", (req, res) => {
  db.prepare("DELETE FROM supervisors WHERE id = ?").run(req.params.id);

  res.json({
    success: true,
    supervisors: allSupervisors(),
  });
});

/* ORDERS */
app.post("/api/orders", (req, res) => {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const order = {
    ...req.body,
    id,
    status: "pending",
    createdAt,
  };

  db.prepare(`
    INSERT INTO orders
    (id, data, status, createdAt)
    VALUES (?, ?, ?, ?)
  `).run(id, JSON.stringify(order), "pending", createdAt);

  res.json({
    success: true,
    order,
  });
});

app.get("/api/orders", (req, res) => {
  const orders = db
    .prepare("SELECT * FROM orders ORDER BY createdAt DESC")
    .all()
    .map((row) => ({
      ...JSON.parse(row.data),
      status: row.status,
    }));

  res.json({
    success: true,
    orders,
  });
});

app.patch("/api/orders/:id/status", (req, res) => {
  const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id);

  if (!row) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  const order = {
    ...JSON.parse(row.data),
    status: req.body.status,
  };

  db.prepare("UPDATE orders SET data = ?, status = ? WHERE id = ?").run(
    JSON.stringify(order),
    req.body.status,
    req.params.id
  );

  const orders = db
    .prepare("SELECT * FROM orders ORDER BY createdAt DESC")
    .all()
    .map((row) => ({
      ...JSON.parse(row.data),
      status: row.status,
    }));

  res.json({
    success: true,
    orders,
  });
});

/* VISITORS */
app.post("/api/visitors", (req, res) => {
  const parser = new UAParser(req.headers["user-agent"]);
  const ua = parser.getResult();

  const visitor = {
    id: crypto.randomUUID(),
    ip:
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "unknown",
    page: req.body.page || "/",
    browser: `${ua.browser.name || "Unknown"} ${ua.browser.version || ""}`,
    os: `${ua.os.name || "Unknown"} ${ua.os.version || ""}`,
    deviceType: ua.device.type || "desktop",
    deviceVendor: ua.device.vendor || "Unknown",
    deviceModel: ua.device.model || "Unknown",
    cpu: ua.cpu.architecture || "Unknown",
    userAgent: req.headers["user-agent"] || "unknown",
    language: req.headers["accept-language"] || "unknown",
    createdAt: new Date().toISOString(),
  };

  db.prepare(`
    INSERT INTO visitors
    (id, data, createdAt)
    VALUES (?, ?, ?)
  `).run(visitor.id, JSON.stringify(visitor), visitor.createdAt);

  res.json({
    success: true,
    visitor,
  });
});

app.get("/api/visitors", (req, res) => {
  const visitors = db
    .prepare("SELECT * FROM visitors ORDER BY createdAt DESC")
    .all()
    .map((row) => JSON.parse(row.data));

  res.json({
    success: true,
    visitors,
  });
});

/* COUPONS */
function allCoupons() {
  return db.prepare("SELECT * FROM coupons ORDER BY createdAt DESC").all().map(toBoolRow);
}

app.get("/api/coupons", (req, res) => {
  res.json({
    success: true,
    coupons: allCoupons(),
  });
});

app.post("/api/coupons", (req, res) => {
  try {
    db.prepare(`
      INSERT INTO coupons
      (id, code, type, value, active, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      String(req.body.code).toUpperCase(),
      req.body.type,
      Number(req.body.value || 0),
      1,
      new Date().toISOString()
    );

    res.json({
      success: true,
      coupons: allCoupons(),
    });
  } catch {
    res.status(400).json({
      success: false,
      message: "Coupon code already exists",
    });
  }
});

app.patch("/api/coupons/:id", (req, res) => {
  const old = db.prepare("SELECT * FROM coupons WHERE id = ?").get(req.params.id);

  if (!old) {
    return res.status(404).json({ success: false, message: "Coupon not found" });
  }

  try {
    db.prepare(`
      UPDATE coupons SET
      code = ?,
      type = ?,
      value = ?,
      active = ?
      WHERE id = ?
    `).run(
      req.body.code !== undefined ? String(req.body.code).toUpperCase() : old.code,
      req.body.type ?? old.type,
      req.body.value !== undefined ? Number(req.body.value) : old.value,
      req.body.active !== undefined ? Number(!!req.body.active) : old.active,
      req.params.id
    );

    res.json({
      success: true,
      coupons: allCoupons(),
    });
  } catch {
    res.status(400).json({
      success: false,
      message: "Coupon code already exists",
    });
  }
});

app.delete("/api/coupons/:id", (req, res) => {
  db.prepare("DELETE FROM coupons WHERE id = ?").run(req.params.id);

  res.json({
    success: true,
    coupons: allCoupons(),
  });
});

app.post("/api/coupons/validate", (req, res) => {
  const { code, subtotal, delivery } = req.body;

  const coupon = db
    .prepare("SELECT * FROM coupons WHERE LOWER(code) = LOWER(?) AND active = 1")
    .get(code);

  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: "Invalid or disabled coupon",
    });
  }

  let discount = 0;

  if (coupon.type === "percent") {
    discount = (Number(subtotal) * Number(coupon.value)) / 100;
  }

  if (coupon.type === "fixed") {
    discount = Number(coupon.value);
  }

  if (coupon.type === "free_delivery") {
    discount = Number(delivery);
  }

  const maxDiscount = Number(subtotal) + Number(delivery);
  discount = Math.min(discount, maxDiscount);

  res.json({
    success: true,
    coupon,
    discount,
  });
});

app.listen(PORT, () => {
  console.log(`BRQ Delivery API running with SQLite on http://localhost:${PORT}`);
});