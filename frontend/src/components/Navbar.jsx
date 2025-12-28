import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Menu, X, UserPlus, LogIn, LogOut, Lock, User } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const NAV_LINKS = [
  { label: "Home", to: "/#home", type: "hash" },
  { label: "Services", to: "/#services", type: "hash" },
  { label: "Plans", to: "/#plans", type: "hash" },
  { label: "Blog", to: "/#blogs", type: "hash" },
  { label: "Testimonials", to: "/#testimonials", type: "hash" },
  { label: "About", to: "/about-us", type: "route" },
  { label: "Contact", to: "/contact", type: "route" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useUserStore();
  const isAdmin =
    user && (user.role === "admin" || user.role === "super_admin");

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-slate-950/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8" />
            <span className="text-lg sm:text-xl font-medium">
              <span className="text-white">EBU</span>
              <span className="text-blue-400">KA</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAV_LINKS.map(({ label, to, type }) =>
              type === "hash" ? (
                <HashLink
                  key={label}
                  smooth
                  to={to}
                  className="text-gray-300 hover:text-white text-sm lg:text-base"
                >
                  {label}
                </HashLink>
              ) : (
                <Link
                  key={label}
                  to={to}
                  className="text-gray-300 hover:text-white text-sm lg:text-base"
                >
                  {label}
                </Link>
              )
            )}

            {/* Role-based links */}
            {isAdmin && (
              <Link
                to="/dashboard"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
              >
                <Lock size={16} />
                Admin
              </Link>
            )}

            {user && !isAdmin && (
              <Link
                to="/user-dashboard"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
              >
                <User size={16} />
                Dashboard
              </Link>
            )}

            {/* Auth buttons */}
            {user ? (
              <button
                onClick={logout}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <UserPlus size={16} />
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <LogIn size={16} />
                  Login
                </Link>
              </>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-gray-200"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-800">
          <nav className="px-4 py-6 space-y-4">
            {NAV_LINKS.map(({ label, to, type }) =>
              type === "hash" ? (
                <HashLink
                  key={label}
                  smooth
                  to={to}
                  onClick={closeMenu}
                  className="block text-gray-300 hover:text-white"
                >
                  {label}
                </HashLink>
              ) : (
                <Link
                  key={label}
                  to={to}
                  onClick={closeMenu}
                  className="block text-gray-300 hover:text-white"
                >
                  {label}
                </Link>
              )
            )}

            <div className="pt-4 border-t border-slate-700 space-y-3">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="w-full bg-blue-500 hover:bg-blue-400 text-white py-2 rounded-md flex items-center justify-center gap-2"
                  >
                    <UserPlus size={16} />
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md flex items-center justify-center gap-2"
                  >
                    <LogIn size={16} />
                    Login
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
