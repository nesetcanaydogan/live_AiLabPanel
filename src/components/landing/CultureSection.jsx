import React from "react";
import { Users, GraduationCap, PartyPopper, Share2 } from "lucide-react";

const CultureSection = () => {
  const items = [
    {
      icon: <GraduationCap size={28} className="text-blue-900" />,
      title: "Eğitim ve Gelişim",
      desc: "Her yıl yeni ve mevcut proje ekiplerimize özel hazırlanan teknik eğitim serileri."
    },
    {
      icon: <PartyPopper size={28} className="text-blue-900" />,
      title: "Sosyal Dinamik",
      desc: "Laboratuvar içi ortak etkinlikler, kutlamalar ve güçlü bir sosyal bağ."
    },
    {
      icon: <Share2 size={28} className="text-blue-900" />,
      title: "Güçlü Ekosistem",
      desc: "Teknik disiplin ile sosyal yapının iç içe geçtiği sürdürülebilir bir çalışma kültürü."
    }
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
          <div className="max-w-xl">
             <div className="inline-flex items-center space-x-2 text-blue-900 font-bold tracking-widest uppercase text-xs mb-4">
                <Users size={14} />
                <span>Topluluk Kültürümüz</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
                Bir Çalışma Alanından Daha Fazlası
              </h2>
          </div>
          <p className="text-gray-500 text-lg max-w-md leading-relaxed">
            Birlikte öğreniyor ve büyüyoruz. Hedefimiz, teknik ve sosyal 
            gelişimi tek bir ekosistemde birleştirmek.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div key={i} className="group p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:bg-blue-900 hover:text-white transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-white/10 group-hover:text-white">
                 {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-gray-500 group-hover:text-blue-100 leading-relaxed text-sm sm:text-base">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CultureSection;
