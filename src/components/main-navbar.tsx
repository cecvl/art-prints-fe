import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  User,
  Settings as SettingsIcon,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { logout } from "@/lib/logout";
import { auth } from "@/lib/firebase";

export function MainNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      setUser(null);
      setShowDropdown(false);
      navigate("/");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <ul className="flex justify-center gap-12 items-center">
          {/* Home */}
          <li className="group relative">
            <Link
              to="/"
              className={cn(
                "flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors",
                location.pathname === "/" && "text-black dark:text-white"
              )}
            >
              <Home className="w-6 h-6" />
              <span className="absolute opacity-0 group-hover:opacity-100 text-xs mt-2 px-2 py-1 rounded bg-black text-white dark:bg-white dark:text-black transition-opacity">
                Home
              </span>
            </Link>
          </li>

          {/* Cart */}
          <li className="group relative">
            <Link
              to="/cart"
              className={cn(
                "flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors",
                location.pathname === "/cart" && "text-black dark:text-white"
              )}
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute opacity-0 group-hover:opacity-100 text-xs mt-2 px-2 py-1 rounded bg-black text-white dark:bg-white dark:text-black transition-opacity">
                Cart
              </span>
            </Link>
          </li>

          {/* Account dropdown */}
          <li className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  className="w-6 h-6 rounded-full"
                  alt="avatar"
                />
              ) : (
                <User className="w-6 h-6" />
              )}
              <span className="text-xs mt-1">Account</span>
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <div className="absolute top-10 right-0 mt-2 w-40 bg-white border rounded shadow z-50">
                <ul className="flex flex-col text-sm">
                  {!user && (
                    <>
                      <li>
                        <Link
                          to="/signin"
                          onClick={() => setShowDropdown(false)}
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Sign In
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/signup"
                          onClick={() => setShowDropdown(false)}
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Sign Up
                        </Link>
                      </li>
                    </>
                  )}
                  {user && (
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Log Out
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </li>

          {/* Settings icon - only if user is signed in */}
          {user && (
            <li className="group relative">
              <Link
                to="/settings"
                className={cn(
                  "flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors",
                  location.pathname === "/settings" &&
                    "text-black dark:text-white"
                )}
              >
                <SettingsIcon className="w-6 h-6" />
                <span className="absolute opacity-0 group-hover:opacity-100 text-xs mt-2 px-2 py-1 rounded bg-black text-white dark:bg-white dark:text-black transition-opacity">
                  Settings
                </span>
              </Link>
            </li>
          )}
          {/* Profile - only if user is signed in */}
          {user && (
            <li className="group relative">
              <Link
                to="/profile"
                className={cn(
                  "flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors",
                  location.pathname === "/profile" &&
                    "text-black dark:text-white"
                )}
              >
                <UserCircle className="w-6 h-6" />
                <span className="absolute opacity-0 group-hover:opacity-100 text-xs mt-2 px-2 py-1 rounded bg-black text-white dark:bg-white dark:text-black transition-opacity">
                  Profile
                </span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
