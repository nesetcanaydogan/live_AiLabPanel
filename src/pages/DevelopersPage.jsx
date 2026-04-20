import React from "react";
import { Terminal, Smartphone, Layout, Sparkles } from "lucide-react";
import DeveloperCard from "../components/DeveloperCard";

const DevelopersPage = () => {
  const developers = [
    {
      name: "Şevval KARAMAN",
      role: "Android Developer & Architect",
      tech: "Kotlin, Jetpack Compose, MVVM",
      github: "https://github.com/sevvalkrmn",
      icon: Smartphone
    },
    {
      name: "İsmail Ayberk SAĞ",
      role: "Backend Developer & Architect",
      tech: ".NET Framework, C#, PostgreSQL",
      github: "https://github.com/ismailayberksag",
      icon: Terminal
    },
    {
      name: "Neşetcan AYDOĞAN",
      role: "Web Developer & Architect",
      tech: "React 19, Vite, TailwindCSS",
      github: "https://github.com/nesetcanaydogan",
      icon: Layout
    }
  ];

  return (
    <div className="relative min-h-screen pb-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-900 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">
            <Sparkles size={14} /> GELİŞTİRİCİ EKİBİ
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Sistemi İnşa Edenler
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            AI LAB Süper Uygulama platformunun mimarisini kurgulayan, kodlayan ve laboratuvarımıza 
            kazandıran çekirdek geliştirme ekibimiz.
          </p>
        </div>

        {/* Developers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developers.map((dev, index) => (
            <DeveloperCard 
              key={index}
              index={index}
              {...dev}
            />
          ))}
        </div>

        {/* Technical Stack Summary */}
        <div className="mt-24 p-8 sm:p-12 bg-blue-900 rounded-3xl text-white overflow-hidden relative shadow-2xl shadow-blue-200">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Teknoloji Vizyonumuz</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Platformumuz; yüksek erişilebilirlik, gerçek zamanlı veri akışı ve katmanlı 
                güvenlik prensipleri üzerine inşa edilmiştir. Android, Web ve Backend katmanları 
                arasında tam senkronizasyon hedeflenmiştir.
              </p>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-3xl font-black">100%</p>
                  <p className="text-[10px] uppercase font-bold text-blue-300">Modern Stack</p>
                </div>
                <div className="w-px h-10 bg-blue-700 mx-2" />
                <div className="text-center">
                  <p className="text-3xl font-black">Secure</p>
                  <p className="text-[10px] uppercase font-bold text-blue-300">Auth & Storage</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['Kotlin', '.NET Core', 'React 19', 'PostgreSQL', 'Firebase', 'Vite'].map((tech) => (
                <div key={tech} className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 font-bold text-sm hover:bg-white/20 transition-colors cursor-default text-center">
                  {tech}
                </div>
              ))}
            </div>
          </div>
          
          {/* Abstract Background Icon */}
          <Terminal className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12 pointer-events-none" />
        </div>

        {/* Footer Note */}
        <div className="mt-20 text-center">
          <p className="text-gray-400 text-sm font-medium">
            KTUN AI & Data Science Laboratory &copy; 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevelopersPage;
