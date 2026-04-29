import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CallToActionFooter = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-8 leading-tight">
          Nice başarılı senelere, birlikte.
        </h2>
        
        <p className="text-lg sm:text-xl text-gray-500 mb-12 leading-relaxed">
          KTUN AI LAB yalnızca öğrencilerin öğrenmesini değil; üretmesini, 
          yarışmasını ve geleceği inşa etmesini hedefleyen güçlü bir teknoloji ekosistemidir.
        </p>
        
        <button
          onClick={() => navigate("/login")}
          className="group inline-flex items-center space-x-3 bg-blue-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-800 transition-all shadow-xl hover:shadow-2xl active:scale-95"
        >
          <span>Ekosisteme Katıl</span>
          <ChevronRight className="group-hover:translate-x-1 transition-transform" size={24} />
        </button>
      </div>
      
      {/* Visual Decor */}
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30"></div>
    </section>
  );
};

export default CallToActionFooter;
