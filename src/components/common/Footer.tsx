
import { Link } from "react-router-dom";
import { Package } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Package className="h-6 w-6 text-medishare-primary" />
              <span className="ml-2 text-lg font-bold text-medishare-dark">MediShare</span>
            </div>
            <p className="text-sm text-gray-600">
              Your trusted online platform for ordering medicines from local pharmacies. Fast, reliable, and secure delivery.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">For Customers</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/customer/pharmacy-selection" className="text-sm text-gray-600 hover:text-medishare-primary">
                  Find Pharmacies
                </Link>
              </li>
              <li>
                <Link to="/customer/medicine-browse" className="text-sm text-gray-600 hover:text-medishare-primary">
                  Browse Medicines
                </Link>
              </li>
              <li>
                <Link to="/customer/order-tracking" className="text-sm text-gray-600 hover:text-medishare-primary">
                  Track Orders
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">For Pharmacists</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/pharmacist/inventory" className="text-sm text-gray-600 hover:text-medishare-primary">
                  Manage Inventory
                </Link>
              </li>
              <li>
                <Link to="/pharmacist/orders" className="text-sm text-gray-600 hover:text-medishare-primary">
                  Process Orders
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-medishare-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-medishare-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-medishare-primary">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600 text-center">
            &copy; {new Date().getFullYear()} MediShare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
