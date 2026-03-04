import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const navLinkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - hidden on mobile, shown on lg+ */}
        <aside className="hidden lg:block w-64 bg-white shadow-lg min-h-[calc(100vh-80px)] fixed left-0 top-[70px] z-30">
          <div className="p-4 border-b border-gray-200">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">A</div>
              <span className="font-bold text-gray-800">Admin Panel</span>
            </Link>
          </div>
          <nav className="p-3 space-y-1">
            <NavLink to="/admin" end className={navLinkClass}>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </span>
            </NavLink>
            <NavLink to="/admin/users" className={navLinkClass}>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Users
              </span>
            </NavLink>
            <NavLink to="/admin/products" className={navLinkClass}>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Products
              </span>
            </NavLink>
            <NavLink to="/admin/analytics" className={navLinkClass}>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </span>
            </NavLink>
            <Link to="/" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Store
              </span>
            </Link>
          </nav>
        </aside>

        {/* Mobile nav tabs */}
        <div className="lg:hidden flex gap-2 p-4 bg-white shadow mb-4 overflow-x-auto">
          <NavLink to="/admin" end className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>
            Users
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>
            Products
          </NavLink>
          <NavLink to="/admin/analytics" className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>
            Analytics
          </NavLink>
          <Link to="/" className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap bg-gray-100 text-gray-700">
            Back to Store
          </Link>
        </div>

        {/* Main content */}
        <main className="flex-1 lg:ml-64 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
