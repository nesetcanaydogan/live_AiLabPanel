import React from "react";
import { Calendar, Award, Star, TrendingUp, ShieldCheck } from "lucide-react";

const TimelineSection = () => {
  const years = [
    {
      year: "2020",
      title: "Temeller Atıldı",
      desc: "Laboratuvar fikrinin oluşması ve ilk kez TEKNOFEST UYZ yarışmasına katılım ile serüven başladı.",
      icon: <Star size={20} className="text-amber-500" />,
      color: "border-amber-500",
    },
    {
      year: "2021",
      title: "Aktif Laboratuvar Dönemi",
      desc: "Sanayi ve Teknoloji Bakanlığı bünyesinde laboratuvar aktif hale geldi. Sağlık, Ulaşım ve Sanayi alanlarında finalistlikler elde edildi.",
      icon: <Calendar size={20} className="text-blue-500" />,
      color: "border-blue-500",
    },
    {
      year: "2022",
      title: "Büyük Projeler ve Fonlar",
      desc: "1M ₺ bütçeli finansal planlama projesi ve TÜBİTAK 2209-A başarıları ile teknik yetkinlik kanıtlandı.",
      icon: <Award size={20} className="text-emerald-500" />,
      color: "border-emerald-500",
    },
    {
      year: "2023",
      title: "İstikrarlı Başarı",
      desc: "Quadriga, Horizon ve NPC AI takımlarıyla TEKNOFEST finalleri ve 'Yenilikçi Yazılım Ödülü' kazanıldı.",
      icon: <TrendingUp size={20} className="text-purple-500" />,
      color: "border-purple-500",
    },
    {
      year: "2024",
      title: "Zirve ve Global Vizyon",
      desc: "3.5M ₺ proje bütçesi, 9 TEKNOFEST projesi ve büyük ölçekli sanayi iş birlikleriyle ekosistem büyümeye devam etti.",
      icon: <ShieldCheck size={20} className="text-blue-900" />,
      color: "border-blue-900",
    },
  ];

  return (
    <section className="py-20 sm:py-32 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
            Nasıl Başladık?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            2020'den bugüne, her yıl katlanarak büyüyen bir başarı hikayesi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {years.map((y, i) => (
            <div key={i} className="relative group">
              {/* Year Bubble */}
              <div
                className={`w-16 h-16 rounded-2xl bg-white shadow-md border-b-4 ${y.color} flex items-center justify-center mb-6 transform group-hover:-translate-y-2 transition-transform duration-300`}
              >
                <span className="font-black text-gray-900 text-lg">
                  {y.year}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-white rounded-lg shadow-sm border border-gray-100">
                    {y.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">
                    {y.title}
                  </h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {y.desc}
                </p>
              </div>

              {/* Connector line for desktop */}
              {i < years.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-16 w-full h-[2px] bg-gray-200 -z-10"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
