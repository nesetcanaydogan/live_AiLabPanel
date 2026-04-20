import React, { useState } from "react";
import { Users, Send, Bell, Menu, X, LayoutDashboard } from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom"; // To render the child-pages
import { useAuth } from "../context/AuthContent";
import Footer from "../components/Footer";

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // To get current URL
  const currentPath = location.pathname; // ./pagename

  const canSendMessages = hasRole("Admin") || hasRole("Captain");

  // Define styling classes for active/deactive buttons
  const getNavStyle = (path, isDisabled = false) => {
    // Styling codes from original MainDashboard
    const baseStyle =
      "px-3 sm:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base border";

    if (isDisabled) {
      return `${baseStyle} bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60`;
    }

    if (currentPath === path) {
      // Active style: blue background
      return `${baseStyle} bg-blue-900 text-white border-transparent`;
    }

    // Deactive style: gray background
    return `${baseStyle} bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200`;
  };

  const getIconNavStyle = (path) => {
    const baseStyle =
      "w-12 h-12 rounded-full flex items-center justify-center transition-colors border";

    if (currentPath === path) {
      return `${baseStyle} bg-blue-900 text-white border-transparent`;
    }
    return `${baseStyle} bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - copied from MainDashboard */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center relative w-full">
            <div className="flex items-center">
              <div className="w-32 h-12 sm:w-40 sm:h-14 rounded-lg flex items-center justify-center m-5">
                <img src="/Group-1.png" alt="Ai Lab Logo" />
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 absolute right-4"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation - copied from MainDashboard */}
      <nav
        className={`bg-white border-b border-gray-200 ${
          mobileMenuOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center py-4 gap-2 md:gap-4">
            <button
              className={getNavStyle("/dashboard")}
              onClick={() => navigate("/dashboard")}
            >
              <LayoutDashboard size={18} />
              <span>Sistem Merkezi</span>
            </button>

            <button
              className={getNavStyle("/team")}
              onClick={() => navigate("/team")}
            >
              <Users size={18} />
              <span>Takımım</span>
            </button>

            <button
              className={getNavStyle("/messages", !canSendMessages)}
              onClick={() => canSendMessages && navigate("/messages")}
              title={!canSendMessages ? "Bu işlem için yetkiniz bulunmuyor." : ""}
            >
              <Send size={18} />
              <span>Mesaj Gönder</span>
            </button>

            <button
              className={getNavStyle("/notifications")}
              onClick={() => navigate("/notifications")}
            >
              <Bell size={18} />
              <span>Bildirimlerim</span>
            </button>

            <button
              className={getNavStyle("/profile")}
              onClick={() => navigate("/profile")}
            >
              <Users size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content - Main Change */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex-grow">
        {/*
          <Outlet /> will render the route from App.jsx to here
        */}
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
