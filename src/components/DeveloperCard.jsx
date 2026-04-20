import React from "react";
import { Github, ExternalLink, Code2, Smartphone, Globe } from "lucide-react";

const DeveloperCard = ({ name, role, tech, github, index }) => {
  // Mapping roles to icons
  const getRoleIcon = (role) => {
    if (role.includes("Android")) return <Smartphone size={20} />;
    if (role.includes("Backend")) return <Code2 size={20} />;
    if (role.includes("Web")) return <Globe size={20} />;
    return <Code2 size={20} />;
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Decorative Gradient Top */}
      <div className="h-2 w-full bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 group-hover:h-3 transition-all duration-500" />
      
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-900 group-hover:bg-blue-900 group-hover:text-white transition-colors duration-500">
            {getRoleIcon(role)}
          </div>
          <a 
            href={github} 
            target="_blank" 
            rel="noreferrer"
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            <Github size={24} />
          </a>
        </div>

        <div className="space-y-2 mb-6">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-300">
            {name}
          </h3>
          <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider">
            {role}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tech.split(", ").map((t, idx) => (
              <span 
                key={idx}
                className="text-[10px] font-bold px-2.5 py-1 bg-gray-50 text-gray-600 rounded-md border border-gray-100 group-hover:border-blue-100 group-hover:bg-blue-50 transition-colors duration-500"
              >
                {t}
              </span>
            ))}
          </div>
          
          <a 
            href={github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-900 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500"
          >
            GitHub Profilini Gör <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Hover Background Pattern */}
      <div className="absolute -bottom-6 -right-6 text-blue-50 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none transform group-hover:scale-150 rotate-12">
        {getRoleIcon(role)}
      </div>
    </div>
  );
};

export default DeveloperCard;
