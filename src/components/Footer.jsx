import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BugReportModal from "./BugReportModal";

const Footer = () => {
  const navigate = useNavigate();
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-white border-t border-gray-200 mt-8 lg:mt-12 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-600">
            <button
              onClick={() => navigate("/terms")}
              className="hover:text-blue-900 transition-colors font-medium"
            >
              Kullanıcı Sözleşmesi
            </button>
            <button
              onClick={() => navigate("/developers")}
              className="hover:text-blue-900 transition-colors font-medium"
            >
              Geliştirici Ekibi
            </button>

            <button
              onClick={() => setIsBugModalOpen(true)}
              className="hover:text-blue-900 transition-colors font-medium"
            >
              İlgili Sayfada Hata Bildir
            </button>
          </div>
        </div>
      </footer>

      {/* Modular Bug Report Modal attached to Footer */}
      <BugReportModal 
        isOpen={isBugModalOpen} 
        onClose={() => setIsBugModalOpen(false)} 
      />
    </>
  );
};

export default Footer;
