import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to: '/', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/warehouses', label: 'Warehouses' },
  { to: '/receipts', label: 'Receipts' },
  { to: '/deliveries', label: 'Deliveries' },
  { to: '/transfers', label: 'Transfers' },
  { to: '/adjustments', label: 'Adjustments' },
  { to: '/move-history', label: 'Move History' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/ai-predictions', label: 'AI Predictions' },
  { to: '/alerts', label: 'Low Stock Alerts' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-surface-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="text-xl font-semibold tracking-tight text-brand-400">
            CoreInventory AI
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <p className="px-4 py-2 text-sm text-slate-400 truncate">{user?.email}</p>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-surface-50">
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
