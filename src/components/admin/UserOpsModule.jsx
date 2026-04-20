import React, { useState, useEffect } from "react";
import { UserCog, Search, History, UserX, AlertTriangle } from "lucide-react";
import apiClient, { getAllUsers, deleteUser, adjustUserScore, getUserTaskHistory } from "../../services/api";
import TaskItem from "../TaskItem"; // Reusing existing TaskItem

const UserOpsModule = () => {
  const [activeTab, setActiveTab] = useState("score"); // 'score' | 'history' | 'delete'
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  // Manual Score State
  const [scoreData, setScoreData] = useState({
    userId: "",
    points: 0,
    reason: "",
  });

  // History State
  const [searchUserId, setSearchUserId] = useState("");
  const [userHistory, setUserHistory] = useState(null); // null = not searched, [] = empty
  const [historyUserFound, setHistoryUserFound] = useState(false);

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers({ PageSize: 1000 });
        const usersData = response.data?.items || response.data || [];
        setAllUsers(Array.isArray(usersData) ? usersData : []);
      } catch (error) {
        console.error("Kullanıcı listesi alınamadı:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleAdjustScore = async (e) => {
    e.preventDefault();
    if (!scoreData.userId || scoreData.points === 0) {
      alert("Lütfen geçerli bir kullanıcı ve puan giriniz.");
      return;
    }
    setLoading(true);
    try {
      await adjustUserScore(scoreData.userId, { 
        amount: Number(scoreData.points), 
        reason: scoreData.reason 
      });
      alert("Puan güncellemesi başarılı.");
      setScoreData({ userId: "", points: 0, reason: "" });
    } catch (error) {
      console.error("Puan güncelleme hatası:", error);
      alert(`Hata oluştu: ${error.response?.data?.message || "İşlem gerçekleştirilemedi. Açıklama girilmemiş olabilir."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchHistory = async (selectedId) => {
    if (!selectedId) {
      setSearchUserId("");
      setUserHistory(null);
      setHistoryUserFound(false);
      return;
    }
    
    setSearchUserId(selectedId);
    setLoading(true);
    setUserHistory(null);
    setHistoryUserFound(false);

    try {
      // Fetch history
      const res = await getUserTaskHistory(selectedId);
      const tasks = res.data.items || res.data || [];
      setUserHistory(tasks);
      setHistoryUserFound(true);
    } catch (error) {
      console.error("Geçmiş çekilemedi:", error);
      alert("Kullanıcı geçmişi alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  const handleForceDelete = async (userId) => {
    if (!userId) return;
    
    const targetUser = allUsers.find(u => u.id === userId);
    const confirmName = prompt(`DİKKAT: "${targetUser?.fullName}" isimli kullanıcıyı tamamen silmek üzeresiniz. Bu işlem GERİ ALINAMAZ.\n\nOnaylamak için kullanıcının tam adını yazınız:`);

    if (confirmName !== targetUser?.fullName) {
      alert("İsim eşleşmedi, silme işlemi iptal edildi.");
      return;
    }

    setLoading(true);
    try {
      await deleteUser(userId);
      alert("Kullanıcı başarıyla silindi.");
      // Refresh user list
      const response = await getAllUsers({ PageSize: 1000 });
      const usersData = response.data?.items || response.data || [];
      setAllUsers(Array.isArray(usersData) ? usersData : []);
      // Reset selection
      setScoreData({ ...scoreData, userId: "" });
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Kullanıcı silinemedi.");
    } finally {
      setLoading(false);
    }
  };

  // Helper formatting (copying from main dashboard logic roughly)
  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("tr-TR");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex space-x-4 border-b border-gray-100 pb-4 mb-6">
        <button
          onClick={() => setActiveTab("score")}
          className={`flex items-center space-x-2 pb-2 px-1 ${
            activeTab === "score"
              ? "text-blue-900 border-b-2 border-blue-900 font-bold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <UserCog size={20} />
          <span>Manuel Puan</span>
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center space-x-2 pb-2 px-1 ${
            activeTab === "history"
              ? "text-blue-900 border-b-2 border-blue-900 font-bold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <History size={20} />
          <span>Görev Geçmişi</span>
        </button>
        <button
          onClick={() => setActiveTab("delete")}
          className={`flex items-center space-x-2 pb-2 px-1 ${
            activeTab === "delete"
              ? "text-red-600 border-b-2 border-red-600 font-bold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <UserX size={20} />
          <span>Kullanıcı Sil</span>
        </button>
      </div>

      {activeTab === "score" && (
        <form onSubmit={handleAdjustScore} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kullanıcı Seçiniz
            </label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-900 outline-none cursor-pointer"
              value={scoreData.userId}
              onChange={(e) =>
                setScoreData({ ...scoreData, userId: e.target.value })
              }
            >
              <option value="">Üye Seçiniz...</option>
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Puan Değişimi (+ veya -)
            </label>
            <input
              type="number"
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
              value={scoreData.points}
              onChange={(e) =>
                setScoreData({ ...scoreData, points: e.target.value })
              }
            />
            <p className="text-xs text-gray-500 mt-1 italic">
              Pozitif değer ekler, negatif değer çıkarır.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sebep / Açıklama
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-900 outline-none resize-none transition-all"
              rows={2}
              value={scoreData.reason}
              onChange={(e) =>
                setScoreData({ ...scoreData, reason: e.target.value })
              }
              placeholder="İşlem gerekçesini yazınız..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors w-full sm:w-auto shadow-md disabled:bg-gray-400"
          >
            {loading ? "Güncelleniyor..." : "Puanı Güncelle"}
          </button>
        </form>
      )}

      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="max-w-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Geçmişini Görmek İstediğiniz Üyeyi Seçiniz
            </label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-900 outline-none cursor-pointer"
              value={searchUserId}
              onChange={(e) => handleSearchHistory(e.target.value)}
            >
              <option value="">Üye Seçiniz...</option>
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} ({u.email})
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="py-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
              <p className="text-gray-400 text-sm mt-2">Geçmiş yükleniyor...</p>
            </div>
          ) : historyUserFound && (
            <div>
              <h4 className="font-bold text-gray-900 mb-4 border-l-4 border-blue-900 pl-3">
                Bulunan Görevler ({userHistory ? userHistory.length : 0})
              </h4>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                {userHistory && userHistory.length > 0 ? (
                  userHistory.map((task) => (
                    <TaskItem
                      key={task.id}
                      date={formatDate(task.dueDate)}
                      title={task.title}
                      status={task.status}
                      assignee={task.assigneeName}
                      project={task.projectName}
                      createdAt={formatDate(task.createdAt)}
                      onClick={() => {}} // History view should be static
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200">
                    Bu kullanıcıya ait henüz bir görev kaydı bulunamadı.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "delete" && (
        <div className="space-y-6 max-w-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex items-start">
            <AlertTriangle className="mr-3 text-red-600 flex-shrink-0" size={24} />
            <div>
              <p className="text-sm text-red-800 font-bold mb-1">
                KRİTİK UYARI: Geri Dönülemez İşlem
              </p>
              <p className="text-xs text-red-700 leading-relaxed">
                Bu kullanıcıyı sildiğinizde; üyeye ait tüm puan geçmişi, proje bağlantıları ve sistem erişim yetkileri <strong>tamamen</strong> kaldırılacaktır. Bu işlem veritabanından geri alınamaz.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Silinecek Kullanıcıyı Seçiniz
            </label>
            <select
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none cursor-pointer bg-white transition-all"
              value={scoreData.userId}
              onChange={(e) => setScoreData({ ...scoreData, userId: e.target.value })}
            >
              <option value="">Silmek istediğiniz üyeyi seçin...</option>
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => handleForceDelete(scoreData.userId)}
            disabled={loading || !scoreData.userId}
            className="px-6 py-4 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all w-full sm:w-auto shadow-lg shadow-red-200 disabled:bg-gray-300 flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Siliniyor...
              </span>
            ) : (
              <>
                <UserX size={18} />
                Kullanıcıyı Tamamen Sil
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserOpsModule;
