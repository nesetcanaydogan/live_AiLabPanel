import React, { useState, useEffect } from "react";
import { FolderPlus, Users, ArrowRight, AlertTriangle, UserPlus, FileText, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import Modal from "../Modal";
import apiClient, { 
  getAllUsers, 
  getAllProjects, 
  getProjectById,
  assignRole,
  addProjectMember,
  createReportRequest,
  getAdminReportRequests,
  reviewReport,
  getReportById,
  createProject,
  transferProjectOwnership,
  getReportRequestById,
  getReportDownloadUrl
} from "../../services/api";
import { useAuth } from "../../context/AuthContent";

const ProjectManagerModule = () => {
  const { refreshProfile, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState("create"); // 'create' | 'transfer' | 'add-member' | 'reports'
  const [allUsers, setAllUsers] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [adminRequests, setAdminRequests] = useState([]);
  const [selectedRequestForDetails, setSelectedRequestForDetails] = useState(null);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);

  // Form States
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    captainUserId: "", 
  });
  const [transferData, setTransferData] = useState({
    projectId: "",
    newCaptainId: "",
  });
  const [addMemberData, setAddMemberData] = useState({
    projectId: "",
    userId: "",
    role: "Member"
  });

  // Report Request Form State
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    dueDate: "",
    periodType: 0,
    periodStart: "",
    periodEnd: "",
    targetProjectIds: [],
    targetAllProjects: true
  });

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [usersRes, projectsRes] = await Promise.all([
          getAllUsers({ PageSize: 1000 }), 
          getAllProjects({ PageSize: 1000 }),
        ]);
        
        const usersData = usersRes.data?.items || usersRes.data || [];
        const projectsData = projectsRes.data?.items || projectsRes.data || [];

        setAllUsers(Array.isArray(usersData) ? usersData : []);
        setAllProjects(Array.isArray(projectsData) ? projectsData : []);
      } catch (error) {
        console.error("Proje yönetim verileri alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch Admin Requests when on reports tab
  useEffect(() => {
    if (activeTab === "reports") {
      fetchAdminRequests();
    }
  }, [activeTab]);

  const fetchAdminRequests = async () => {
    try {
      const res = await getAdminReportRequests({ PageSize: 50 });
      setAdminRequests(res.data?.items || res.data || []);
    } catch (error) {
      console.error("Rapor talepleri alınamadı");
    }
  };

  const handleIncele = async (req) => {
    // Show basic info first, then enrich if needed
    setSelectedRequestForDetails({ ...req, isLoading: true });
    
    try {
      // Fetch full details to get descriptions and targeted teams more reliably
      const fullRes = await getReportRequestById(req.id);
      setSelectedRequestForDetails({ ...fullRes.data, isLoading: false });
    } catch (error) {
      console.error("Talep detayı alınamadı");
      setSelectedRequestForDetails({ ...req, isLoading: false });
    }
  };

  const handleViewReport = async (reportId) => {
    try {
      const res = await getReportDownloadUrl(reportId);
      const url = res.data?.downloadUrl || res.data; 
      if (url) {
        window.open(url, "_blank");
      } else {
        alert("İndirme bağlantısı alınamadı.");
      }
    } catch (error) {
      console.error("Rapor açma hatası:", error);
      alert("Rapor dosyasına erişilemiyor.");
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    
    // Basic Client-side Validation
    if (!newRequest.dueDate || !newRequest.periodStart || !newRequest.periodEnd) {
      alert("Lütfen tüm tarih alanlarını doldurun.");
      return;
    }

    setLoading(true);
    try {
      // Robust Date Parsing
      const payload = {
        ...newRequest,
        dueDate: new Date(newRequest.dueDate).toISOString(),
        periodStart: new Date(newRequest.periodStart).toISOString(),
        periodEnd: new Date(newRequest.periodEnd).toISOString(),
        periodType: Number(newRequest.periodType),
        // Ensure array is present even if targeting all
        targetProjectIds: newRequest.targetAllProjects ? [] : newRequest.targetProjectIds
      };

      await createReportRequest(payload);
      alert("Rapor talebi başarıyla yayınlandı.");
      
      setNewRequest({
        title: "", description: "", dueDate: "",
        periodType: 0, periodStart: "", periodEnd: "",
        targetProjectIds: [], targetAllProjects: true
      });
      fetchAdminRequests();
    } catch (error) {
      console.error("Talep oluşturma hatası detaylı:", error);
      
      const responseData = error.response?.data;
      let specificMsg = "";

      if (responseData?.errors) {
        const firstKey = Object.keys(responseData.errors)[0];
        specificMsg = responseData.errors[firstKey][0];
      } else {
        specificMsg = responseData?.message || responseData?.title || error.message;
      }
      
      // If specificMsg is still empty or generic, check if it's a network error
      if (error.message === "Network Error") {
        alert("Bağlantı Hatası: Sunucuya ulaşılamıyor veya CORS engeline takıldı. Lütfen internet bağlantınızı ve API adresini kontrol edin.");
      } else {
        alert("Hata: " + (specificMsg || "İşlem gerçekleştirilemedi."));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (reportId, status) => {
    const reason = prompt("İnceleme notu (Opsiyonel):");
    try {
      await reviewReport(reportId, { status, reason: reason || "" });
      alert("Rapor güncellendi.");
      fetchAdminRequests();
    } catch (error) {
      alert("Hata oluştu.");
    }
  };

  const handleProjectSelectForRequest = (projectId) => {
    setNewRequest(prev => {
      const current = prev.targetProjectIds;
      const updated = current.includes(projectId) 
        ? current.filter(id => id !== projectId)
        : [...current, projectId];
      return { ...prev, targetProjectIds: updated, targetAllProjects: false };
    });
  };

  // Fetch details of the selected project when projectId changes in Transfer tab
  useEffect(() => {
    const fetchProjectMembers = async () => {
      if (!transferData.projectId) {
        setSelectedProjectDetails(null);
        return;
      }

      try {
        setMembersLoading(true);
        const res = await getProjectById(transferData.projectId);
        setSelectedProjectDetails(res.data);
      } catch (error) {
        console.error("Proje detayları alınamadı:", error);
        setSelectedProjectDetails(null);
      } finally {
        setMembersLoading(false);
      }
    };

    fetchProjectMembers();
  }, [transferData.projectId]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!addMemberData.projectId || !addMemberData.userId) {
      alert("Lütfen proje ve üye seçiniz.");
      return;
    }

    setLoading(true);
    try {
      await addProjectMember(addMemberData.projectId, {
        userId: addMemberData.userId,
        role: addMemberData.role
      });

      alert("Üye başarıyla projeye eklendi.");
      setAddMemberData({ ...addMemberData, userId: "", role: "Member" });
    } catch (error) {
      console.error("Üye ekleme hatası:", error);
      alert(`Hata: ${error.response?.data?.message || "Üye eklenemedi."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.captainUserId) {
      alert("Lütfen bir kaptan seçin.");
      return;
    }
    setLoading(true);
    try {
      await createProject(newProject);
      
      try {
        await assignRole(newProject.captainUserId, "Captain");
      } catch (roleErr) {
        console.error("Kaptan rolü atanamadı:", roleErr);
      }

      alert("Proje başarıyla oluşturuldu ve kaptan atandı.");
      setNewProject({ name: "", description: "", captainUserId: "" });
      
      const projectsRes = await getAllProjects({ PageSize: 1000 });
      const projectsData = projectsRes.data?.items || projectsRes.data || [];
      setAllProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (error) {
      console.error("Proje oluşturma hatası:", error);
      alert(`Hata oluştu: ${error.response?.data?.message || "Sunucu isteği reddetti."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferOwnership = async (e) => {
    e.preventDefault();
    if (!transferData.projectId || !transferData.newCaptainId) {
      alert("Lütfen proje ve yeni kaptan seçiniz.");
      return;
    }

    const currentCaptain = selectedProjectDetails?.captains?.[0];
    if (!currentCaptain) {
      alert("Projenin mevcut kaptan bilgisi alınamadı.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        currentCaptainId: currentCaptain.userId,
        newCaptainId: transferData.newCaptainId
      };

      await transferProjectOwnership(transferData.projectId, payload);

      try {
        await assignRole(transferData.newCaptainId, "Captain");
      } catch (roleErr) {
        console.error("Yeni kaptan rolü atanamadı:", roleErr);
      }

      alert("Devir işlemi başarılı ve yeni kaptan yetkilendirildi.");
      
      // Refresh local profile to ensure current user's role is updated immediately if they were involved
      try { await refreshProfile(); } catch (e) {}

      setTransferData({ projectId: "", newCaptainId: "" });
      setSelectedProjectDetails(null);
    } catch (error) {
      console.error("Devir hatası:", error);
      alert(`Hata oluştu: ${error.response?.data?.message || "İşlem gerçekleştirilemedi."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex space-x-4 border-b border-gray-100 pb-4 mb-6">
        <button
          onClick={() => setActiveTab("create")}
          className={`flex items-center space-x-2 pb-2 px-1 ${
            activeTab === "create"
              ? "text-blue-900 border-b-2 border-blue-900 font-bold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FolderPlus size={20} />
          <span>Yeni Proje</span>
        </button>
        <button
          onClick={() => setActiveTab("transfer")}
          className={`flex items-center space-x-2 pb-2 px-1 ${
            activeTab === "transfer"
              ? "text-blue-900 border-b-2 border-blue-900 font-bold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Users size={20} />
          <span>Kaptanlık Devri</span>
        </button>
        <button
          onClick={() => setActiveTab("add-member")}
          className={`flex items-center space-x-2 pb-2 px-1 ${
            activeTab === "add-member"
              ? "text-blue-900 border-b-2 border-blue-900 font-bold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <UserPlus size={20} />
          <span>Üye Ekle</span>
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`flex items-center space-x-2 pb-2 px-1 ${
            activeTab === "reports"
              ? "text-blue-900 border-b-2 border-blue-900 font-bold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FileText size={20} />
          <span>Rapor Yönetimi</span>
        </button>
      </div>

      {activeTab === "create" && (
        <form onSubmit={handleCreateProject} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proje Adı</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
            <textarea
              required
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-900 outline-none resize-none transition-all"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Takım Kaptanı Seçiniz</label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-900 outline-none cursor-pointer"
              value={newProject.captainUserId}
              onChange={(e) => setNewProject({ ...newProject, captainUserId: e.target.value })}
            >
              <option value="">Üye Seçiniz...</option>
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors w-full sm:w-auto shadow-md disabled:bg-gray-400"
          >
            {loading ? "Oluşturuluyor..." : "Projeyi Oluştur"}
          </button>
        </form>
      )}

      {activeTab === "transfer" && (
        <form onSubmit={handleTransferOwnership} className="space-y-4 max-w-lg">
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 mb-4">
            <p className="text-sm text-yellow-800 flex items-center font-medium">
              <AlertTriangle className="mr-2 flex-shrink-0" size={18} />
              Dikkat: Devir işlemi seçilen projedeki kaptan yetkisini yeni üyeye aktarır.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proje Seçiniz</label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-900 outline-none cursor-pointer"
              value={transferData.projectId}
              onChange={(e) => setTransferData({ ...transferData, projectId: e.target.value, newCaptainId: "" })}
            >
              <option value="">Proje Seçiniz...</option>
              {allProjects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Kaptan Seçiniz</label>
            <select
              required
              disabled={!transferData.projectId || membersLoading}
              className={`w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-900 outline-none cursor-pointer ${(!transferData.projectId || membersLoading) ? 'bg-gray-50' : 'bg-white'}`}
              value={transferData.newCaptainId}
              onChange={(e) => setTransferData({ ...transferData, newCaptainId: e.target.value })}
            >
              <option value="">{membersLoading ? "Üyeler Yükleniyor..." : "Yeni Kaptan Seçiniz..."}</option>
              {selectedProjectDetails?.members?.map((m) => (
                <option key={m.userId} value={m.userId}>{m.fullName}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading || !transferData.newCaptainId}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors w-full sm:w-auto flex items-center justify-center shadow-md disabled:bg-gray-400"
          >
            {loading ? "İşleniyor..." : "Kaptanlığı Devret"} <ArrowRight className="ml-2" size={18}/>
          </button>
        </form>
      )}

      {activeTab === "add-member" && (
        <form onSubmit={handleAddMember} className="space-y-4 max-w-lg">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
            <p className="text-sm text-blue-800 flex items-center font-medium">
              <UserPlus className="mr-2 flex-shrink-0" size={18} />
              Üyeyi veritabanından seçerek projeye dahil edin.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hedef Proje</label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-900 outline-none cursor-pointer"
              value={addMemberData.projectId}
              onChange={(e) => setAddMemberData({ ...addMemberData, projectId: e.target.value })}
            >
              <option value="">Proje Seçiniz...</option>
              {allProjects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Eklenecek Üye</label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-900 outline-none cursor-pointer"
              value={addMemberData.userId}
              onChange={(e) => setAddMemberData({ ...addMemberData, userId: e.target.value })}
            >
              <option value="">Üye Seçiniz...</option>
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Üye Rolü</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-900 outline-none"
              placeholder="Örn: Geliştirici..."
              value={addMemberData.role}
              onChange={(e) => setAddMemberData({ ...addMemberData, role: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !addMemberData.userId || !addMemberData.projectId}
            className="px-6 py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors w-full sm:w-auto shadow-md disabled:bg-gray-400"
          >
            {loading ? "Ekleniyor..." : "Üyeyi Projeye Dahil Et"}
          </button>
        </form>
      )}

      {activeTab === "reports" && (
        <div className="space-y-8">
          {/* Part 1: Create Request */}
          <section className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-blue-900" />
              Yeni Rapor Talebi Oluştur
            </h4>
            <form onSubmit={handleCreateRequest} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Başlık</label>
                <input 
                  type="text" required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Açıklama</label>
                <textarea 
                  rows={2} required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm resize-none"
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Son Teslim Tarihi</label>
                <input 
                  type="datetime-local" required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                  value={newRequest.dueDate}
                  onChange={(e) => setNewRequest({...newRequest, dueDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Periyot Tipi (0-3)</label>
                <input 
                  type="number" required min="0" max="3"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                  value={newRequest.periodType}
                  onChange={(e) => setNewRequest({...newRequest, periodType: parseInt(e.target.value)})}
                />
                <p className="text-[10px] text-gray-400 mt-1 italic">0: Haftalık, 1: Aylık, 2: Dönemlik, 3: Yıllık</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Kapsam Başlangıç</label>
                <input 
                  type="datetime-local" required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                  value={newRequest.periodStart}
                  onChange={(e) => setNewRequest({...newRequest, periodStart: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Kapsam Bitiş</label>
                <input 
                  type="datetime-local" required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                  value={newRequest.periodEnd}
                  onChange={(e) => setNewRequest({...newRequest, periodEnd: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Hedef Projeler</label>
                <div className="flex items-center mb-3">
                  <input 
                    type="checkbox" id="targetAll"
                    className="mr-2"
                    checked={newRequest.targetAllProjects}
                    onChange={(e) => setNewRequest({...newRequest, targetAllProjects: e.target.checked, targetProjectIds: []})}
                  />
                  <label htmlFor="targetAll" className="text-sm font-medium text-gray-700 cursor-pointer">Tüm Projelere Gönder</label>
                </div>
                
                {!newRequest.targetAllProjects && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-3 bg-white border rounded-lg border-gray-200">
                    {allProjects.map(p => (
                      <label key={p.id} className="flex items-center text-xs cursor-pointer hover:text-blue-900">
                        <input 
                          type="checkbox" className="mr-2"
                          checked={newRequest.targetProjectIds.includes(p.id)}
                          onChange={() => handleProjectSelectForRequest(p.id)}
                        />
                        {p.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button 
                  type="submit" disabled={loading}
                  className="px-8 py-3 bg-blue-900 text-white rounded-lg font-bold text-sm hover:bg-blue-800 transition-all shadow-md"
                >
                  {loading ? "Yayınlanıyor..." : "Talebi Yayınla"}
                </button>
              </div>
            </form>
          </section>

          {/* Part 2: List Requests & Submissions */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Column A: Requests */}
            <section>
              <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-blue-900" />
                Aktif Rapor Talepleri
              </h4>
              <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Başlık</th>
                      <th className="px-6 py-4 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {adminRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900 line-clamp-1">{req.title}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            Son: {new Date(req.dueDate).toLocaleDateString("tr-TR")}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleIncele(req)}
                            className="text-blue-900 font-bold hover:underline"
                          >
                            İncele
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Column B: Submissions (Gelenler) */}
            <section>
              <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-green-600" />
                Gelenler (Firebase Linkleri)
              </h4>
              <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-gray-50 min-h-[300px]">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-widest border-b">
                    <tr>
                      <th className="px-4 py-4">Takım / Rapor</th>
                      <th className="px-4 py-4 text-right">Dosya</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminRequests.flatMap(req => req.submissions || req.reports || []).length > 0 ? (
                      adminRequests.flatMap(req => req.submissions || req.reports || []).map((sub) => (
                        <tr key={sub.id} className="hover:bg-white transition-colors">
                          <td className="px-4 py-4">
                            <p className="font-bold text-gray-900 line-clamp-1">{sub.projectName || "Bilinmiyor"}</p>
                            <p className="text-[10px] text-gray-400">{sub.title}</p>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button 
                              onClick={() => handleViewReport(sub.id)}
                              className="inline-flex items-center gap-1 text-green-700 font-bold hover:underline"
                            >
                              <ExternalLink size={14} /> Aç
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="px-4 py-10 text-center text-gray-400 italic">
                          Henüz bir rapor gönderimi bulunmuyor.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* --- Report Request Detail Modal --- */}
      <Modal
        isOpen={!!selectedRequestForDetails}
        onClose={() => setSelectedRequestForDetails(null)}
        title="Rapor Talebi Detayı"
      >
        {selectedRequestForDetails && (
          <div className="space-y-6">
            <div>
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Başlık</h5>
              <p className="text-lg font-bold text-gray-900">{selectedRequestForDetails.title}</p>
            </div>

            <div>
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Açıklama</h5>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 leading-relaxed">
                {selectedRequestForDetails.isLoading ? "Yükleniyor..." : (selectedRequestForDetails.description || "Açıklama belirtilmemiş.")}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Son Tarih</h5>
                <p className="text-sm font-medium">{new Date(selectedRequestForDetails.dueDate).toLocaleString("tr-TR")}</p>
              </div>
              <div>
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Periyot</h5>
                <p className="text-sm font-medium">
                  {["Haftalık", "Aylık", "Dönemlik", "Yıllık"][selectedRequestForDetails.periodType] || "Genel"}
                </p>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Hedeflenen Takımlar</h5>
              <div className="flex flex-wrap gap-2">
                {selectedRequestForDetails.targetAllProjects ? (
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded">TÜM PROJELER</span>
                ) : (
                  selectedRequestForDetails.targetProjectNames?.map((name, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 rounded">
                      {name}
                    </span>
                  )) || <span className="text-xs text-gray-400 italic">Belirli takımlar seçilmiş</span>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProjectManagerModule;
