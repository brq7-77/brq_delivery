export const rolePermissions = {
  Owner: ["dashboard", "orders", "visitors", "restaurants", "products", "coupons", "supervisors"],
  Manager: ["dashboard", "orders", "restaurants", "products", "coupons"],
  Supervisor: ["dashboard", "orders"],
  Support: ["dashboard", "orders", "visitors"],
};

export function canAccess(user, page) {
  if (!user) return false;
  return rolePermissions[user.role]?.includes(page);
}