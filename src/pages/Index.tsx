
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAuth } from "../contexts/AuthContext";
import { Package, ShoppingCart, Calendar, User } from "lucide-react";

const Index = () => {
  const { isAuthenticated, currentRole } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-medishare-light to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-medishare-dark leading-tight mb-4">
                  Your Health, Delivered
                </h1>
                <p className="text-lg text-gray-700 mb-8">
                  Order medicines online from trusted local pharmacies and get them delivered to your doorstep. Fast, reliable, and secure.
                </p>
                <div className="flex flex-wrap gap-4">
                  {isAuthenticated ? (
                    <Link to={currentRole === "customer" ? "/customer" : "/pharmacist"}>
                      <Button size="lg" className="bg-medishare-primary hover:bg-medishare-dark">
                        Go to Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/register">
                        <Button size="lg" className="bg-medishare-primary hover:bg-medishare-dark">
                          Get Started
                        </Button>
                      </Link>
                      <Link to="/login">
                        <Button size="lg" variant="outline">
                          Login
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="/placeholder.svg" 
                  alt="Medicine Delivery" 
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-medishare-dark mb-4">How MediShare Works</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A simple, secure process to get your medications delivered safely and quickly.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-medishare-light rounded-full mb-4">
                  <User className="w-8 h-8 text-medishare-primary" />
                </div>
                <h3 className="text-xl font-semibold text-medishare-dark mb-2">Create an Account</h3>
                <p className="text-gray-600">Sign up as a customer to order medicines or as a pharmacist to list your inventory.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-medishare-light rounded-full mb-4">
                  <ShoppingCart className="w-8 h-8 text-medishare-primary" />
                </div>
                <h3 className="text-xl font-semibold text-medishare-dark mb-2">Select & Order</h3>
                <p className="text-gray-600">Browse medicines from local pharmacies, add to cart, and check out securely.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-medishare-light rounded-full mb-4">
                  <Package className="w-8 h-8 text-medishare-primary" />
                </div>
                <h3 className="text-xl font-semibold text-medishare-dark mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Track your order in real-time and receive your medicines safely at your doorstep.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-medishare-dark mb-4">Why Choose MediShare</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our platform connects customers with trusted local pharmacies for a seamless medicine ordering experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Verified Pharmacies",
                  description: "All pharmacies on our platform are licensed and verified for your safety."
                },
                {
                  title: "Prescription Management",
                  description: "Easily upload and manage your prescriptions for medication orders."
                },
                {
                  title: "Real-time Tracking",
                  description: "Track your medicine delivery in real-time from pharmacy to your doorstep."
                },
                {
                  title: "Secure Payments",
                  description: "Multiple secure payment options including cash on delivery."
                },
                {
                  title: "Medication Reminders",
                  description: "Set up reminders to never miss your medication schedule."
                },
                {
                  title: "24/7 Support",
                  description: "Our customer support team is available round the clock to assist you."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-medishare-dark mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-medishare-primary py-16 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to start using MediShare?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of users who trust MediShare for their medicine delivery needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="bg-white text-medishare-primary hover:bg-gray-100">
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
