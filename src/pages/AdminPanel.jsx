import React, { useState } from "react";
import { ShieldCheck, UserCog, Briefcase, FileText, Users } from "lucide-react";
import TaskScoringModule from "../components/admin/TaskScoringModule";
import ProjectManagerModule from "../components/admin/ProjectManagerModule";
import UserOpsModule from "../components/admin/UserOpsModule";
import ListInsideUsersModule from "../components/admin/ListInsideUsersModule";
import ListAllUsersModule from "../components/admin/ListAllUsersModule";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("scoring"); // 'scoring' | 'projects' | 'users' | 'inside' | 'all-users'

  // Senior Architect Note:
  // Redundant security useEffect and isAuthorized state removed.
  // Authorization is now handled by the router-level ProtectedRoute in App.jsx.
  // This prevents unauthorized API calls from triggering on mount and improves component cleanlines.

  // Define Tabs
  const tabs = [
    { id: "scoring", label: "Görev Puanlama", icon: <FileText size={20} /> },
    { id: "projects", label: "Proje Yönetimi", icon: <Briefcase size={20} /> },
    { id: "users", label: "Kullanıcı İşlemleri", icon: <UserCog size={20} /> },
    { id: "inside", label: "Laboratuvarda Olanlar", icon: <Users size={20} /> },
    { id: "all-users", label: "Tüm Üyeleri Listele", icon: <Briefcase size={20} /> },
  ];

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ShieldCheck className="mr-3 text-blue-900" size={32} />
            Yönetici Paneli
          </h1>
          <p className="text-gray-500 mt-1">
            Sistem yönetimi, proje atamaları ve puanlama merkezi.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-900 border-b-2 border-blue-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content */}
      <div className="transition-all duration-300">
        {activeTab === "scoring" && <TaskScoringModule />}
        {activeTab === "projects" && <ProjectManagerModule />}
        {activeTab === "users" && <UserOpsModule />}
        {activeTab === "inside" && <ListInsideUsersModule />}
        {activeTab === "all-users" && <ListAllUsersModule />}
      </div>
    </div>
  );
};

export default AdminPanel;
