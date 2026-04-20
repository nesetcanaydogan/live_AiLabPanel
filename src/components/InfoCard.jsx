import React from "react";

const InfoCard = ({title, children, className = ""}) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm p-4 sm:p-6 h-full flex flex-col ${className}`}>
      {/* Card Header */}
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
        {title}
      </h3>
      
      {/* Card Content (Flexible area) */}
      <div className="flex-grow space-y-3">
        {children}
      </div>
    </div>
    )
}

export default InfoCard;