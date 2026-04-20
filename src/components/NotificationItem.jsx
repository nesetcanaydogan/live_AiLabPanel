import React from "react";
import { ArrowRight } from "lucide-react";

const NotificationItem = ({ date, title, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer group"
    >
      {/* Date */}
      <p className="text-xs text-gray-500 mb-1">{date}</p>

      {/* Header and Link */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
        <p className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-0">
          {title}
        </p>

        {/* Color changing link with 'group-hover' */}
        <span className="text-blue-900 text-xs font-bold flex items-center group-hover:text-blue-700 transition-colors">
          devamını oku <ArrowRight size={14} className="ml-1" />
        </span>
      </div>
    </div>
  );
};

export default NotificationItem;
