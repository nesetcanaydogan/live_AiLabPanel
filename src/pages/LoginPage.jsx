import React from "react";
import LoginForm from "../components/auth/LoginForm";
import Footer from "../components/Footer";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Logo */}
      <header className="bg-white py-6 sm:py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="inline-flex flex-col items-center">
              <div className="w-32 h-12 sm:w-40 sm:h-14 rounded-lg flex items-center justify-center mb-3 sm:mb-4 my-3">
                <img src="/Group-1.png" alt="Ai Lab Logo" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0D1552] my-3 mb-0">
                Sistem Yönetim Paneli
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Login Form */}
      <main className="flex-grow py-6 sm:py-8 lg:py-12 flex items-center">
        <div className="w-full max-w-md mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 lg:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-10">
              Giriş Yap
            </h2>

            {/* Use the modular LoginForm component which handles Firebase + API Sync */}
            <LoginForm />
          </div>

          {/* Divider with "New Member" Text */}
          <div className="relative my-8 sm:my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gray-50 text-sm sm:text-base text-gray-600">
                Yeni üye isen
              </span>
            </div>
          </div>

          {/* Register Button - Logic handled by navigation, no change needed here */}
          <div className="px-4 sm:px-6">
            <a
              href="/register"
              className="w-full block text-center bg-white text-gray-900 py-4 rounded-full font-semibold text-base sm:text-lg border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Hesap kaydı için başvur
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
