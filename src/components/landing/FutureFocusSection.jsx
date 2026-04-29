import React from "react";
import { Target, Zap, Cpu, BrainCircuit, Laptop } from "lucide-react";

const FutureFocusSection = () => {
  const focuses = [
    {
      icon: <Laptop className="text-blue-600" size={32} />,
      title: "AI Agents",
      desc: "Otonom karar verebilen yapay zeka ajanları üzerine derinlemesine çalışmalar.",
    },
    {
      icon: <Zap className="text-amber-500" size={32} />,
      title: "Agentic Systems",
      desc: "Karmaşık görevleri yürütebilen ajan tabanlı sistem mimarileri.",
    },
    {
      icon: <Cpu className="text-emerald-500" size={32} />,
      title: "NLP",
      desc: "Doğal dil işleme ve büyük dil modelleri (LLM) entegrasyonu.",
    },
    {
      icon: <BrainCircuit className="text-purple-500" size={32} />,
      title: "Cognitive AI",
      desc: "Bilişsel süreçleri otomize eden ve karar mekanizmalarını simüle eden sistemler.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Side: Focus Cards */}
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-flex items-center space-x-2 text-blue-900 font-bold tracking-widest uppercase text-xs">
              <Target size={14} />
              <span>Yeni Çalışma Alanlarımız</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Gelecek Burada Başlıyor:
              <br />
              <span className="text-blue-900">Agentic & Cognitive AI</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              2025 ve 2026 hedeflerimiz doğrultusunda, laboratuvarımız yapay
              zekanın en ileri uçlarındaki yeni ekipler ve çalışma alanlarıyla
              büyümeye devam ediyor.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {focuses.map((f, i) => (
                <div
                  key={i}
                  className="p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="mb-3">{f.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Major Highlight */}
          <div className="lg:w-1/2 w-full">
            <div className="p-8 sm:p-12 bg-blue-900 rounded-[2.5rem] text-white shadow-2xl relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <BrainCircuit size={120} />
              </div>

              <div className="relative z-10">
                <div className="bg-white/20 inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-6">
                  KRİTİK BAŞARI
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-6 leading-snug">
                  TÜBİTAK 1812 BİGG Program Adayı Projelerimiz
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/10 p-3 rounded-xl mt-1">
                      <Target size={24} className="text-blue-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Agentic Systems</h4>
                      <p className="text-blue-100 text-sm mt-1">
                        İlk aşama kabulü almış, otonom sistem odaklı yenilikçi
                        proje.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/10 p-3 rounded-xl mt-1">
                      <Cpu size={24} className="text-blue-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">
                        Cognitive Digital Twin Architecture
                      </h4>
                      <p className="text-blue-100 text-sm mt-1">
                        İlk aşama kabulü almış, bilişsel dijital ikiz mimarisi
                        üzerine kurgulanmış ileri teknoloji çalışması.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureFocusSection;
