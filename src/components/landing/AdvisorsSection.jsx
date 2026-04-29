import React from "react";
import { UserCheck } from "lucide-react";

const AdvisorsSection = () => {
  const advisors = [
    { name: "Doç. Dr. Sait Ali Uymaz", title: "Akademik Danışman", mail: "sauymaz@ktun.edu.tr" },
    { name: "Doç. Dr. Ersin Kaya", title: "Akademik Danışman", mail: "ekaya@ktun.edu.tr" }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
           <div className="inline-flex items-center space-x-2 text-blue-900 font-bold tracking-widest uppercase text-xs mb-8">
              <UserCheck size={14} />
              <span>Akademik Kadromuz</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              {advisors.map((adv, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <UserCheck className="text-blue-900" size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 text-lg sm:text-xl">{adv.name}</h3>
                    <p className="text-gray-500 text-sm font-medium">{adv.title}</p>
                    <p className="text-blue-900 text-sm font-medium">{adv.mail}</p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default AdvisorsSection;
