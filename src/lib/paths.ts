type SignInReason = "expired" | "registered" | "deleted";
type OrdersView = "admin";

export const paths = {
  home: () => "/",
  catalog: () => "/catalog",
  signIn: (opts?: { reason?: SignInReason }) =>
    opts?.reason ? `/sign-in?reason=${opts.reason}` : "/sign-in",
  signUp: () => "/sign-up",
  cart: () => "/cart",
  orders: {
    list: (view?: OrdersView) => (view ? "/orders?view=admin" : "/orders"),
    detail: (orderNumber: string) => `/orders/${orderNumber}`,
  },
  profile: {
    me: () => "/profile",
    adminDetail: (id: number) => `/profile/${id}`,
  },
  products: {
    detail: (id: number) => `/products/${id}`,
    create: () => "/products/new",
  },
  admin: {
    users: () => "/admin/users",
    sessions: () => "/admin/sessions",
    categories: () => "/admin/category-management",
    stock: () => "/admin/stock-management",
  },
} as const;
