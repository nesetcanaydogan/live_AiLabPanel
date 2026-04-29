import React from "react";
import { Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-16 sm:pt-48 sm:pb-24 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-900 px-4 py-2 rounded-full text-sm font-bold mb-6 animate-fade-in">
          <span>Yapay Zeka ve Veri Bilimi Laboratuvarı</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-blue-900 mb-6 tracking-tight leading-tight">
          KTUN AI LAB
        </h1>

        <p className="text-xl sm:text-2xl font-semibold text-gray-800 mb-8 max-w-2xl mx-auto leading-relaxed">
          Mühendislik ve inovasyon odaklı öğrenci laboratuvarı
        </p>

        <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Teknofest, TÜBİTAK yarışmaları; hackathonlar ve gerçek dünya
          projeleriyle öğrencilerin teknik üretim yapmasını sağlayan bir
          laboratuvar ekosistemi.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
