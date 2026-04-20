import React from "react";
import RegisterForm from "../components/auth/RegisterForm";
import Footer from "../components/Footer";

const RegistrationForm = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Logo */}
      <header className="bg-white py-6 sm:py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
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

      {/* Main Form */}
      <main className="flex-grow py-6 sm:py-8 lg:py-12 flex items-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full">
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 lg:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-10">
              Kayıt Başvurusu
            </h2>

            {/* Use the modular RegisterForm component (Firebase + Backend) */}
            <RegisterForm />

            {/* Terms Text */}
            <p className="text-center text-xs sm:text-sm text-gray-600 pt-6">
              Başvuru yaparak{" "}
              <a
                href="#"
                className="text-blue-900 underline hover:text-blue-700"
              >
                Kullanıcı Sözleşmesi
              </a>{" "}
              kurallarını kabul etmiş olursunuz.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegistrationForm;
