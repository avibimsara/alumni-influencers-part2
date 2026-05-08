import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FilterProvider } from '../context/FilterContext.jsx';

const Layout = () => {
  const { user, logout }    = useAuth();
  const navigate            = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard',        label: '🏠 Dashboard',       end: true },
    { to: '/dashboard/trends', label: '📈 Trends & Charts'            },
    { to: '/dashboard/alumni', label: '👥 View Alumni'                },
    { to: '/dashboard/admin',  label: '🔑 API Keys'                   },
  ];

  return (
    <div className="flex h-screen bg-gray-100">

      {/* ── Sidebar ── */}
      <aside className={`
        bg-white border-r border-gray-200 flex flex-col
        transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? 'w-14' : 'w-64'}
      `}>

        {/* Header + toggle button */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-gray-200 min-h-[64px]">
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-base font-bold text-indigo-600 whitespace-nowrap">
                Alumni Portal
              </h1>
              <p className="text-xs text-gray-400 truncate max-w-[160px]">
                {user?.email}
              </p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="ml-auto p-1.5 rounded hover:bg-gray-100 text-gray-500 flex-shrink-0"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2 py-3 space-y-1">
          {navLinks.map(({ to, label, end }) => {
            const [icon, ...rest] = label.split(' ');
            const text = rest.join(' ');
            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                title={collapsed ? text : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <span className="text-base flex-shrink-0">{icon}</span>
                {!collapsed && (
                  <span className="whitespace-nowrap overflow-hidden">{text}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-2 py-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <span className="text-base flex-shrink-0">🚪</span>
            {!collapsed && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto min-w-0">

        {/* Top bar — shows on narrow screens */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 md:hidden">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
          >
            ☰
          </button>
          <span className="text-sm font-semibold text-indigo-600">Alumni Portal</span>
        </div>

        <div className="p-4 md:p-6">
          <FilterProvider>
            <Outlet />
          </FilterProvider>
        </div>
      </main>

    </div>
  );
};

export default Layout;