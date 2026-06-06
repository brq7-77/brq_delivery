const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function createOrder(order) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  return res.json();
}

export async function getOrders() {
  const res = await fetch(`${API_URL}/orders`);
  return res.json();
}

export async function updateOrderStatusApi(id, status) {
  const res = await fetch(`${API_URL}/orders/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return res.json();
}

export async function trackVisitor(page = "/") {
  const res = await fetch(`${API_URL}/visitors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ page }),
  });

  return res.json();
}

export async function getVisitors() {
  const res = await fetch(`${API_URL}/visitors`);
  return res.json();
}

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  return res.json();
}

export async function createProduct(product) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return res.json();
}

export async function updateProduct(id, product) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });

  return res.json();
}

export async function getSupervisors() {
  const res = await fetch(`${API_URL}/supervisors`);
  return res.json();
}

export async function createSupervisor(supervisor) {
  const res = await fetch(`${API_URL}/supervisors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(supervisor),
  });

  return res.json();
}

export async function updateSupervisor(id, supervisor) {
  const res = await fetch(`${API_URL}/supervisors/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(supervisor),
  });

  return res.json();
}

export async function deleteSupervisor(id) {
  const res = await fetch(`${API_URL}/supervisors/${id}`, {
    method: "DELETE",
  });

  return res.json();
}

export async function adminLogin(identifier, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier, password }),
  });

  return res.json();
}

export async function getRestaurants() {
  const res = await fetch(`${API_URL}/restaurants`);
  return res.json();
}

export async function createRestaurant(restaurant) {
  const res = await fetch(`${API_URL}/restaurants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(restaurant),
  });

  return res.json();
}

export async function updateRestaurant(id, restaurant) {
  const res = await fetch(`${API_URL}/restaurants/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(restaurant),
  });

  return res.json();
}

export async function deleteRestaurant(id) {
  const res = await fetch(`${API_URL}/restaurants/${id}`, {
    method: "DELETE",
  });

  return res.json();
}

export async function getCoupons() {
  const res = await fetch(`${API_URL}/coupons`);
  return res.json();
}

export async function createCoupon(coupon) {
  const res = await fetch(`${API_URL}/coupons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(coupon),
  });

  return res.json();
}

export async function updateCoupon(id, coupon) {
  const res = await fetch(`${API_URL}/coupons/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(coupon),
  });

  return res.json();
}

export async function deleteCoupon(id) {
  const res = await fetch(`${API_URL}/coupons/${id}`, {
    method: "DELETE",
  });

  return res.json();
}

export async function validateCoupon(code, subtotal, delivery) {
  const res = await fetch(`${API_URL}/coupons/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, subtotal, delivery }),
  });

  return res.json();
}
