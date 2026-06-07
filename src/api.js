import { supabase } from "./supabaseClient";

function mapRestaurant(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category || "Burgers",
    rating: Number(row.rating || 4.5),
    deliveryTime: row.delivery_time || "25-35 min",
    image: row.image || "",
    description: row.description || "",
    active: row.active,
    createdAt: row.created_at,
  };
}

function mapProduct(row) {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    name: row.name,
    category: row.category || "Burgers",
    price: Number(row.price || 0),
    rating: Number(row.rating || 4.5),
    image: row.image || "",
    description: row.description || "",
    active: row.active,
    createdAt: row.created_at,
  };
}

function mapCoupon(row) {
  return {
    id: row.id,
    code: row.code,
    type: row.type,
    value: Number(row.value || 0),
    active: row.active,
    createdAt: row.created_at,
  };
}

function mapSupervisor(row) {
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    email: row.email,
    password: row.password,
    role: row.role,
    active: row.active,
    createdAt: row.created_at,
  };
}

function mapOrder(row) {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    address: row.address,
    note: row.note,
    restaurant: row.restaurant,
    items: row.items || [],
    total: Number(row.total || 0),
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapVisitor(row) {
  return {
    id: row.id,
    ip: row.ip || "Unknown",
    country: row.country || "Unknown",
    city: row.city || "Unknown",
    browser: row.browser || "Unknown",
    os: row.os || "Unknown",
    device: row.device || "Unknown",
    path: row.path || "/",
    createdAt: row.created_at,
  };
}

async function refreshRestaurants() {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("RESTAURANTS DATA:", data);
  console.log("RESTAURANTS ERROR:", error);

  return { success: !error, restaurants: (data || []).map(mapRestaurant), error };
}

async function refreshProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("PRODUCTS DATA:", data);
  console.log("PRODUCTS ERROR:", error);

  return { success: !error, products: (data || []).map(mapProduct), error };
}

async function refreshCoupons() {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  return { success: !error, coupons: (data || []).map(mapCoupon), error };
}

async function refreshSupervisors() {
  const { data, error } = await supabase
    .from("supervisors")
    .select("*")
    .order("created_at", { ascending: false });

  return { success: !error, supervisors: (data || []).map(mapSupervisor), error };
}

async function refreshOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return { success: !error, orders: (data || []).map(mapOrder), error };
}

export async function getRestaurants() {
  return refreshRestaurants();
}

export async function createRestaurant(restaurant) {
  const { error } = await supabase.from("restaurants").insert({
    name: restaurant.name,
    category: restaurant.category,
    rating: Number(restaurant.rating || 4.5),
    delivery_time: restaurant.deliveryTime,
    image: restaurant.image,
    description: restaurant.description,
    active: true,
  });

  if (error) return { success: false, restaurants: [], error };
  return refreshRestaurants();
}

export async function updateRestaurant(id, restaurant) {
  const payload = {
    name: restaurant.name,
    category: restaurant.category,
    rating: Number(restaurant.rating || 4.5),
    delivery_time: restaurant.deliveryTime,
    image: restaurant.image,
    description: restaurant.description,
  };

  if (restaurant.active !== undefined) payload.active = restaurant.active;

  const { error } = await supabase.from("restaurants").update(payload).eq("id", id);
  if (error) return { success: false, restaurants: [], error };
  return refreshRestaurants();
}

export async function toggleRestaurantStatus(id, active) {
  const { error } = await supabase.from("restaurants").update({ active }).eq("id", id);
  if (error) return { success: false, error };
  return refreshRestaurants();
}

export async function deleteRestaurant(id) {
  const { error } = await supabase.from("restaurants").delete().eq("id", id);
  if (error) return { success: false, restaurants: [], error };
  return refreshRestaurants();
}

export async function getProducts() {
  return refreshProducts();
}

export async function createProduct(product) {
  const { error } = await supabase.from("products").insert({
    restaurant_id: product.restaurantId,
    name: product.name,
    category: product.category,
    price: Number(product.price || 0),
    rating: Number(product.rating || 4.5),
    image: product.image,
    description: product.description,
    active: true,
  });

  if (error) return { success: false, products: [], error };
  return refreshProducts();
}

export async function updateProduct(id, product) {
  const payload = {
    restaurant_id: product.restaurantId,
    name: product.name,
    category: product.category,
    price: Number(product.price || 0),
    rating: Number(product.rating || 4.5),
    image: product.image,
    description: product.description,
  };

  if (product.active !== undefined) payload.active = product.active;

  const { error } = await supabase.from("products").update(payload).eq("id", id);
  if (error) return { success: false, products: [], error };
  return refreshProducts();
}

export async function toggleProductStatus(id, active) {
  const { error } = await supabase.from("products").update({ active }).eq("id", id);
  if (error) return { success: false, error };
  return refreshProducts();
}

export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { success: false, products: [], error };
  return refreshProducts();
}

export async function getCoupons() {
  return refreshCoupons();
}

export async function createCoupon(coupon) {
  console.log("CREATING COUPON:", coupon);

  const { data, error } = await supabase
    .from("coupons")
    .insert({
      code: coupon.code?.trim().toUpperCase(),
      type: coupon.type,
      value: coupon.type === "free_delivery" ? 0 : Number(coupon.value || 0),
      active: true,
    })
    .select();

  console.log("COUPON RESULT:", data);
  console.log("COUPON ERROR:", error);

  if (error) {
    return {
      success: false,
      coupons: [],
      message: error.message,
      error,
    };
  }

  return refreshCoupons();
}

export async function updateCoupon(id, coupon) {
  const payload = {};

  if (coupon.code !== undefined) payload.code = coupon.code?.trim().toUpperCase();
  if (coupon.type !== undefined) payload.type = coupon.type;
  if (coupon.value !== undefined) payload.value = Number(coupon.value || 0);
  if (coupon.active !== undefined) payload.active = coupon.active;

  const { error } = await supabase
    .from("coupons")
    .update(payload)
    .eq("id", id);

  if (error) return { success: false, coupons: [], message: error.message, error };
  return refreshCoupons();
}

export async function toggleCouponStatus(id, active) {
  const { error } = await supabase.from("coupons").update({ active }).eq("id", id);
  if (error) return { success: false, error };
  return refreshCoupons();
}

export async function deleteCoupon(id) {
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) return { success: false, coupons: [], error };
  return refreshCoupons();
}

export async function validateCoupon(code) {
  const cleanCode = code.trim().toUpperCase();

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", cleanCode)
    .eq("active", true)
    .maybeSingle();

  if (error || !data) {
    return { success: false, message: "Invalid coupon." };
  }

  return { success: true, coupon: mapCoupon(data) };
}

export async function getSupervisors() {
  return refreshSupervisors();
}

export async function createSupervisor(supervisor) {
  return saveSupervisor(supervisor);
}

export async function updateSupervisor(id, supervisor) {
  return saveSupervisor({
    ...supervisor,
    id,
  });
}

export async function saveSupervisor(supervisor) {
  const payload = {
    name: supervisor.name,
    username: supervisor.username,
    email: supervisor.email,
    password: supervisor.password,
    role: supervisor.role,
    active: supervisor.active ?? true,
  };

  let error;

  if (supervisor.id) {
    const result = await supabase.from("supervisors").update(payload).eq("id", supervisor.id);
    error = result.error;
  } else {
    const result = await supabase.from("supervisors").insert(payload);
    error = result.error;
  }

  if (error) return { success: false, supervisors: [], error };
  return refreshSupervisors();
}

export async function toggleSupervisorStatus(id, active) {
  const { error } = await supabase.from("supervisors").update({ active }).eq("id", id);
  if (error) return { success: false, error };
  return refreshSupervisors();
}

export async function deleteSupervisor(id) {
  const { error } = await supabase.from("supervisors").delete().eq("id", id);
  if (error) return { success: false, supervisors: [], error };
  return refreshSupervisors();
}

export async function getOrders() {
  return refreshOrders();
}

export async function createOrder(order) {
  const payload = {
    customer_name: order.customer?.name || order.customerName || order.name || "",
    phone: order.customer?.phone || order.phone || "",
    address: order.customer?.address || order.address || "",
    note: order.customer?.notes || order.note || order.notes || "",
    restaurant: order.items?.[0]?.restaurant || "",
    items: order.items || [],
    total: Number(order.total || 0),
    status: order.status || "pending",
  };

  console.log("ORDER PAYLOAD:", payload);

  const { data, error } = await supabase
    .from("orders")
    .insert(payload)
    .select()
    .single();

  console.log("ORDER RESULT:", data);
  console.log("ORDER ERROR:", error);

  if (error) return { success: false, message: error.message, error };

  return {
    success: true,
    order: mapOrder(data),
  };
}

export async function updateOrderStatus(id, status) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) return { success: false, error };
  return refreshOrders();
}

export async function updateOrderStatusApi(id, status) {
  return updateOrderStatus(id, status);
}

export async function getVisitors() {
  const { data, error } = await supabase
    .from("visitors")
    .select("*")
    .order("created_at", { ascending: false });

  return { success: !error, visitors: (data || []).map(mapVisitor), error };
}

export async function recordVisitor(visitor = {}) {
  const { error } = await supabase.from("visitors").insert({
    ip: visitor.ip || "Unknown",
    country: visitor.country || "Unknown",
    city: visitor.city || "Unknown",
    browser: visitor.browser || navigator.userAgent,
    os: visitor.os || "Unknown",
    device: visitor.device || "Unknown",
    path: window.location.pathname,
  });

  return { success: !error, error };
}

export async function trackVisitor(visitor = {}) {
  return recordVisitor(visitor);
}
