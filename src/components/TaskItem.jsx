import React from "react";

const STATUS_CONFIG = {
  0: { label: "Başlanmadı", color: "bg-red-500", text: "text-red-600" },
  1: { label: "Devam ediyor", color: "bg-gray-500", text: "text-gray-600" }, // In Progress
  2: { label: "Tamamlandı", color: "bg-green-500", text: "text-green-600" },
};

const TaskItem = ({ date, title, status = 0, onClick, assignee, project, createdAt }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG[0];

  return (
    <div
      onClick={onClick}
      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        {project ? (
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
            {project}
          </span>
        ) : (
          <span></span> // Spacer
        )}
        <p className="text-xs text-gray-500">STT: {date}</p>
      </div>

      <p className="text-sm sm:text-base font-bold text-gray-900 mb-3 line-clamp-2">
        {title}
      </p>

      <div className="flex items-end justify-between border-t border-gray-200 pt-2 mt-2">
        <div className="flex flex-col space-y-0.5">
          {assignee && (
            <span className="text-xs text-gray-700 font-medium flex items-center">
              👤 {assignee}
            </span>
          )}
          {createdAt && (
            <span className="text-[10px] text-gray-400">
              {createdAt}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1.5 bg-white px-2 py-1 rounded border border-gray-100 shadow-sm">
          <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
          <span className={`text-xs font-medium ${config.text}`}>
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
