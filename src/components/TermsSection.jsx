import React from "react";

const TermsSection = ({ title, children, icon: Icon }) => {
  return (
    <section className="mb-8 last:mb-0">
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div className="p-2 bg-blue-50 rounded-lg text-blue-900">
            <Icon size={20} />
          </div>
        )}
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          {title}
        </h2>
      </div>
      <div className="pl-2 border-l-2 border-gray-100 ml-4">
        <div className="text-sm text-gray-600 leading-relaxed space-y-3">
          {children}
        </div>
      </div>
    </section>
  );
};

export default TermsSection;
