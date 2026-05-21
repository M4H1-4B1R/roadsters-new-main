import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderTree,
  Truck,
  Layout,
  Image,
  Images,
  Percent,
  Mail,
  LogOut,
} from "lucide-react";
import logoutAction from "./logout-action";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart, disabled: true },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
];

const soonItems = [
  { label: "Shipping Options", icon: Truck },
  { label: "Website Sections", icon: Layout },
  { label: "Banners", icon: Image },
  { label: "Gallery Swiper", icon: Images },
  { label: "Coupons", icon: Percent },
  { label: "NewsLetters", icon: Mail },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-50">
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-base font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-tight">
          Clicks E-Commerce Panel
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">
          Main Menu
        </p>
        {navItems.map((item) =>
          item.disabled ? (
            <span
              key={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 cursor-not-allowed opacity-60"
            >
              <item.icon size={18} />
              {item.label}
            </span>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        )}

        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 pt-4 pb-1">
          Coming Soon
        </p>
        {soonItems.map((item) => (
          <span
            key={item.label}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 cursor-not-allowed opacity-60"
          >
            <item.icon size={18} />
            {item.label}
          </span>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
