import React, { useState, useEffect } from "react";
import {
  Users,
  LayoutDashboard,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
} from "lucide-react";
import {
  getMyProjects,
  getMyTasks,
  getGlobalRoomStats,
  getTeammateRoomStats,
  getMyRoomStats,
} from "../services/api.js";
import {
  getMyAnnouncements,
  getAnnouncementById,
  markAsRead,
} from "../services/announcementService.js";
import { useAuth } from "../context/AuthContent.jsx";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import TaskItem from "../components/TaskItem";

const MainDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dashboard Stats State
  const [stats, setStats] = useState({
    projectCount: 0,
    activeTeamName: "Yükleniyor...",
    tasks: [],
    occupancy: { current: 0, total: 0 },
    teammates: { inside: 0, total: 0 },
    lastEntry: null,
  });

  // Announcements State
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch everything in parallel
        const results = await Promise.allSettled([
          getMyProjects(),
          getMyTasks(),
          getGlobalRoomStats(),
          getTeammateRoomStats(),
          getMyRoomStats(),
          getMyAnnouncements(1, 5), // Fetch top 5 announcements
        ]);

        const projectsRes =
          results[0].status === "fulfilled" ? results[0].value : { data: [] };
        const tasksRes =
          results[1].status === "fulfilled" ? results[1].value : { data: [] };
        const globalStatsRes =
          results[2].status === "fulfilled" ? results[2].value : { data: {} };
        const teammatesStatsRes =
          results[3].status === "fulfilled" ? results[3].value : { data: {} };
        const myStatsRes =
          results[4].status === "fulfilled" ? results[4].value : { data: {} };
        const announcementsRes =
          results[5].status === "fulfilled" ? results[5].value : { items: [] };

        const projects = projectsRes?.data || [];
        const taskResponseData = tasksRes?.data;
        const tasks = Array.isArray(taskResponseData)
          ? taskResponseData
          : taskResponseData?.items || [];

        // Stats with safe method
        const globalStats = globalStatsRes?.data || {};
        const teammatesStats = teammatesStatsRes?.data || {};
        const myStats = myStatsRes?.data || {};

        setStats({
          projectCount: projects.length,
          activeTeamName:
            projects.length > 0 ? projects[0].name : "Henüz bir takımınız yok.",
          tasks: tasks,
          occupancy: {
            current: globalStats.currentOccupancyCount || 0,
            total: globalStats.totalCapacity || 0,
          },
          teammates: {
            inside: teammatesStats.teammatesInsideCount || 0,
            total: teammatesStats.totalTeammatesCount || 0,
          },
          lastEntry: myStats.lastEntryDate || null,
        });

        // Set Announcements
        setAnnouncements(announcementsRes.items || []);
      } catch (error) {
        // Error logging handled by api.js
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle Announcement Click
  const handleAnnouncementClick = async (summaryItem) => {
    setSelectedAnnouncement({ ...summaryItem, isLoading: true });

    try {
      if (!summaryItem.isRead) {
        await markAsRead(summaryItem.id);
        setAnnouncements((prev) =>
          prev.map((a) =>
            a.id === summaryItem.id ? { ...a, isRead: true } : a,
          ),
        );
      }
      const fullDetails = await getAnnouncementById(summaryItem.id);
      setSelectedAnnouncement(fullDetails);
    } catch (error) {
      console.error("Duyuru detayı alınamadı");
    }
  };

  // Date formatting
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Henüz giriş yok";
    const date = new Date(dateString);
    // Backend manually sends UTC+3, causing a +3 hour shift in local parsing.
    // Subtracting 3 hours to normalize.
    date.setHours(date.getHours() - 3);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-24 mt-4">
        {/* 1. Üst İstatistik Kartı */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 lg:mb-8 border border-gray-100">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <LayoutDashboard className="mr-2 text-blue-900" size={24} />
            Genel Bakış
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Sol: Genel Doluluk (DİNAMİK) */}
            {stats.occupancy.current > 16 ? (
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-red-800 text-sm font-medium mb-1">
                  Laboratuvar Anlık Durumu [Kapasite Aşımı]
                </p>
                <p className="text-3xl font-bold text-red-900">
                  {stats.occupancy.current}{" "}
                  <span className="text-lg text-red-600 font-normal">
                    / 16 Kişi
                  </span>
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-800 text-sm font-medium mb-1">
                  Laboratuvar Anlık Durumu
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {stats.occupancy.current}{" "}
                  <span className="text-lg text-blue-600 font-normal">
                    / 16 Kişi
                  </span>
                </p>
              </div>
            )}

            {/* Sağ: Takım Arkadaşları (DİNAMİK) */}
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-green-800 text-sm font-medium mb-1">
                İçerideki Takım Arkadaşları
              </p>
              <p className="text-3xl font-bold text-green-900">
                {stats.teammates.inside}{" "}
                <span className="text-lg text-green-600 font-normal">
                  / {stats.teammates.total} Üye
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 2. Üç Sütunlu Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Sol: Aktivitem */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 h-full">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="mr-2 text-gray-500" size={20} /> Aktivitem
            </h3>
            <div className="space-y-3">
              {/* Laboratuvara Son Giriş (DİNAMİK) */}
              <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <p className="text-xs text-gray-500 mb-1">
                  Laboratuvara Son Giriş
                </p>
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  {formatDateTime(stats.lastEntry)}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <p className="text-xs text-gray-500 mb-1">Aktif Takımım</p>
                <p className="text-base sm:text-lg font-bold text-gray-900 truncate">
                  {stats.activeTeamName}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <p className="text-xs text-gray-500 mb-1">
                  Dahil Olduğum Projeler
                </p>
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  {stats.projectCount} Proje
                </p>
              </div>
            </div>
          </div>

          {/* Orta: Mesajlar (DİNAMİK) */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 h-full">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center justify-between">
              <span>Mesajlarım</span>
              <button
                onClick={() => navigate("/notifications")}
                className="text-xs text-blue-900 font-medium hover:underline"
              >
                Tümünü Gör
              </button>
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {loading ? (
                <p className="text-center text-gray-400 text-sm">
                  Yükleniyor...
                </p>
              ) : announcements.length > 0 ? (
                announcements.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => handleAnnouncementClick(msg)}
                    className={`rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200 
                      ${msg.isRead ? "bg-gray-50" : "bg-blue-50 border-blue-100"}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-xs text-gray-500">
                        {msg.scope === 0 ? "Sistem" : "Takım"}
                      </p>
                      {!msg.isRead && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p
                      className={`text-sm text-gray-900 line-clamp-2 ${!msg.isRead ? "font-bold" : "font-medium"}`}
                    >
                      {msg.title}
                    </p>
                    <span className="text-blue-600 text-xs font-medium mt-1 block">
                      okumak için tıkla
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-400">Yeni mesajınız yok.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sağ: Takım Görevleri (Dinamik) */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 h-full">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="mr-2 text-gray-500" size={20} /> Görevlerim
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {loading ? (
                <p className="text-center text-gray-400 text-sm">
                  Yükleniyor...
                </p>
              ) : stats.tasks.length > 0 ? (
                stats.tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    date={formatDate(task.dueDate)}
                    title={task.title}
                    status={task.status}
                    assignee={task.assigneeName}
                    project={task.projectName}
                    createdAt={formatDate(task.createdAt)}
                    onClick={() =>
                      navigate("/team", { state: { selectedTask: task } })
                    }
                  />
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-400">
                    Aktif görev bulunmuyor.
                  </p>
                  <button
                    onClick={() => navigate("/team")}
                    className="mt-2 text-blue-900 text-xs font-bold hover:underline"
                  >
                    Takım sayfasına git
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Announcement Detail Modal */}
      <Modal
        isOpen={!!selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        title={selectedAnnouncement?.title || "Duyuru"}
      >
        {selectedAnnouncement?.isLoading ? (
          <p className="text-center text-gray-400">Yükleniyor...</p>
        ) : (
          selectedAnnouncement && (
            <div className="space-y-4">
              <div className="text-xs text-gray-400 border-b pb-2">
                {formatDate(selectedAnnouncement.createdAt)}
              </div>
              <div
                className="text-sm text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: selectedAnnouncement.content,
                }}
              />
            </div>
          )
        )}
      </Modal>
    </>
  );
};

export default MainDashboard;
