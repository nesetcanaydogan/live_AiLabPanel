import React from "react";
import { Globe, Compass, ExternalLink } from "lucide-react";

const GlobalVisionSection = () => {
  return (
    <section className="py-24 px-4 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[3rem] p-8 sm:p-16 border border-gray-100 shadow-sm relative">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

          <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
            {/* Image Placeholder with Icon */}
            <div className="lg:w-1/2 w-full">
              <div className="aspect-square sm:aspect-video bg-gray-100 rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 group hover:border-blue-200 transition-colors">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe size={40} className="text-blue-900" />
                </div>
                <p className="text-gray-400 font-medium italic">
                  Quadriga Rover Work Visual
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-900 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                <Compass size={14} />
                <span>Uluslararası Vizyon</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Sınırları Aşan Bir Mühendislik Tutkusu:{" "}
                <span className="text-blue-900">Quadriga</span>
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                Laboratuvarımız yalnızca lokal değil, uluslararası vizyona sahip
                bir ekosistemdir.
                <strong>
                  {" "}
                  Amerika - University Rover Challenge (URC), European Rover
                  Challenge (ERC)
                </strong>{" "}
                çalışmaları ve
                <strong> Anatolian Rover Challenge</strong> finalleri ile
                küresel standartlarda mühendislik üretiyoruz.
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 text-sm font-bold text-gray-900 bg-gray-100 px-4 py-2 rounded-xl">
                  <span>URC Amerika Çalışmaları</span>
                </div>
                <div className="flex items-center space-x-2 text-sm font-bold text-gray-900 bg-gray-100 px-4 py-2 rounded-xl">
                  <span>Rover Design & Control</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalVisionSection;
