import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, UserPlus, Gift, ClipboardList, Settings, FileText, Image, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/clients', label: 'Clients', icon: Users },
  { to: '/admin/referrals', label: 'Referrals', icon: UserPlus },
  { to: '/admin/rewards', label: 'Rewards', icon: Gift },
  { to: '/admin/redemptions', label: 'Redemptions', icon: ClipboardList },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/audit-log', label: 'Audit Log', icon: FileText },
  { to: '/admin/media', label: 'Media', icon: Image },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-purple-400 rounded border border-purple-700"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-gray-900 to-black text-white flex flex-col border-r-2 border-purple-800
        transform transition-transform duration-200 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-purple-900">
          <h1 className="text-2xl font-bold glow-text tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>TATS by TATS</h1>
          <p className="text-xs text-purple-400 mt-1 tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.15em' }}>ADMIN TERMINAL</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded transition-all border ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-800 to-purple-900 text-white border-purple-600 glow-purple' 
                    : 'text-gray-400 hover:bg-gray-900 hover:text-purple-300 border-transparent hover:border-purple-800'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-purple-900">
          <div className="flex items-center justify-between bg-gray-900/50 p-2 rounded border border-purple-900">
            <span className="text-xs text-purple-400 tracking-wider">{user?.name || 'Admin'}</span>
            <button onClick={handleLogout} className="text-gray-500 hover:text-purple-400 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto relative">
        <Outlet />
      </main>
    </div>
  );
}
