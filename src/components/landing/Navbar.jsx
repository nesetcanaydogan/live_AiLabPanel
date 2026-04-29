import React from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img src="/Group-1.png" alt="Ai Lab Logo" className="h-8 sm:h-10 w-auto" />
          </div>

          {/* Action Button */}
          <div>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center space-x-2 bg-blue-900 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm sm:text-base font-semibold hover:bg-blue-800 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <LogIn size={18} />
              <span>Sisteme Giriş Yap</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
