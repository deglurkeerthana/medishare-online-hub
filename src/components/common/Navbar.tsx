
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { Button } from "../ui/button";
import { ShoppingCart, User, Package } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, currentRole, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Package className="h-8 w-8 text-medishare-primary" />
              <span className="ml-2 text-xl font-bold text-medishare-dark">MediShare</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                {currentRole === "customer" ? (
                  <>
                    <Link to="/customer" className="text-gray-600 hover:text-medishare-primary px-3 py-2 rounded-md text-sm font-medium">
                      Dashboard
                    </Link>
                    <Link to="/customer/pharmacy-selection" className="text-gray-600 hover:text-medishare-primary px-3 py-2 rounded-md text-sm font-medium">
                      Pharmacies
                    </Link>
                    <Link to="/customer/medicine-browse" className="text-gray-600 hover:text-medishare-primary px-3 py-2 rounded-md text-sm font-medium">
                      Medicines
                    </Link>
                    <Link to="/customer/order-tracking" className="text-gray-600 hover:text-medishare-primary px-3 py-2 rounded-md text-sm font-medium">
                      My Orders
                    </Link>
                    <Link to="/customer/cart" className="relative text-gray-600 hover:text-medishare-primary px-3 py-2 rounded-md text-sm font-medium">
                      <ShoppingCart className="h-5 w-5" />
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-medishare-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/pharmacist" className="text-gray-600 hover:text-medishare-primary px-3 py-2 rounded-md text-sm font-medium">
                      Dashboard
                    </Link>
                    <Link to="/pharmacist/inventory" className="text-gray-600 hover:text-medishare-primary px-3 py-2 rounded-md text-sm font-medium">
                      Inventory
                    </Link>
                    <Link to="/pharmacist/orders" className="text-gray-600 hover:text-medishare-primary px-3 py-2 rounded-md text-sm font-medium">
                      Orders
                    </Link>
                  </>
                )}
                <div className="flex items-center pl-4 border-l">
                  <span className="text-sm text-gray-600 mr-2">
                    <User className="inline-block h-4 w-4 mr-1" />
                    {user?.name}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {isAuthenticated && currentRole === "customer" && (
              <Link to="/customer/cart" className="relative text-gray-600 mr-4">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-medishare-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-medishare-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-medishare-primary"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {isAuthenticated ? (
            <>
              <div className="px-4 py-2 border-b border-gray-200">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </div>
              </div>
              {currentRole === "customer" ? (
                <>
                  <Link
                    to="/customer"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medishare-primary hover:bg-gray-50"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/customer/pharmacy-selection"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medishare-primary hover:bg-gray-50"
                    onClick={toggleMenu}
                  >
                    Pharmacies
                  </Link>
                  <Link
                    to="/customer/medicine-browse"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medishare-primary hover:bg-gray-50"
                    onClick={toggleMenu}
                  >
                    Medicines
                  </Link>
                  <Link
                    to="/customer/order-tracking"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medishare-primary hover:bg-gray-50"
                    onClick={toggleMenu}
                  >
                    My Orders
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/pharmacist"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medishare-primary hover:bg-gray-50"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/pharmacist/inventory"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medishare-primary hover:bg-gray-50"
                    onClick={toggleMenu}
                  >
                    Inventory
                  </Link>
                  <Link
                    to="/pharmacist/orders"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medishare-primary hover:bg-gray-50"
                    onClick={toggleMenu}
                  >
                    Orders
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medishare-primary hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medishare-primary hover:bg-gray-50"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medishare-primary hover:bg-gray-50"
                onClick={toggleMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
