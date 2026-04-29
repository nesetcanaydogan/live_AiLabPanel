import React from "react";
import { Award, Trophy, Rocket, Cpu, FlaskConical } from "lucide-react";

const ProjectsAwardsSection = () => {
  const awards = [
    "Ulaşımda Yapay Zeka - Yenilikçi Yazılım Ödülü",
    "Kapsül TP Özel Ödülü (32 Bit İşlemci Tasarımı)",
    "İDEÇ Ödülü",
    "Mepsan Ödülü",
    "Türk Kadınlar Birliği Ödülü",
  ];

  const projects = [
    {
      title: "Metal Kesme Makineleri",
      subtitle: "3.5M ₺ Bütçeli Sanayi Projesi",
      desc: "Yapay zeka tabanlı yeni nesil şerit testereli makinelerde izlenebilirlik ve kestirimci bakım çözümleri.",
      icon: <Cpu size={24} className="text-blue-900" />,
    },
    {
      title: "Derin Öğrenme ile İnme Tespiti",
      subtitle: "TÜBİTAK 2209-A Projelerimizden",
      desc: "BT görüntülerinde derin öğrenme ile segmentasyon yapan gelişmiş web platformu.",
      icon: <FlaskConical size={24} className="text-blue-900" />,
    },
    {
      title: "Finansal Planlama Sistemi",
      subtitle: "1M ₺ Bütçeli Proje",
      desc: "Yapay zeka destekli nakit akışı ve finansal planlama optimizasyon projesi.",
      icon: <Rocket size={24} className="text-blue-900" />,
    },
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Projects Column */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
              <Rocket className="text-blue-900" />
              <span>Öne Çıkan Projelerimiz</span>
            </h2>
            <div className="space-y-6">
              {projects.map((p, i) => (
                <div
                  key={i}
                  className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-blue-50/50 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                      {p.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {p.title}
                      </h3>
                      <p className="text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                        {p.subtitle}
                      </p>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Awards Column */}
          <div className="bg-blue-900 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 opacity-10">
              <Trophy size={200} />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-8 flex items-center space-x-3">
                <Trophy className="text-blue-300" />
                <span>Ödüllerimizden Bazıları</span>
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {awards.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm"
                  >
                    <Award className="text-blue-300 flex-shrink-0" size={20} />
                    <span className="font-medium text-sm sm:text-base leading-tight">
                      {a}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-2">
                  Ek Başarılar
                </p>
                <p className="text-sm italic">
                  "2021'den bu yana Sağlık, Ulaşım ve Sanayi alanlarında 10+
                  finalistlik ve en iyi sunum, en iyi yazılım ödülleri."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsAwardsSection;
