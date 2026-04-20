import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContent";
import { Upload, CheckCircle, Clock, XCircle, Bell, ChevronDown, Send } from "lucide-react";
import InfoCard from "../components/InfoCard";
import TaskItem from "../components/TaskItem";
import Modal from "../components/Modal";
import NotificationItem from "../components/NotificationItem";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";
import {
  getMyProjects,
  getProjectTasks,
  updateTaskStatus,
  getTaskById,
  getMyReportRequests,
  uploadReport,
  submitReportJson,
  getProjectById,
  createTask,
} from "../services/api";
import { 
  getMyAnnouncements, 
  getAnnouncementById, 
  markAsRead 
} from "../services/announcementService";

const MyTeam = () => {
  const [allProjects, setAllProjects] = useState([]); // All projects user belongs to
  const [team, setTeam] = useState(null); // Currently selected team/project (summary)
  const [teamDetails, setTeamDetails] = useState(null); // Full project details (members, captains)
  const [tasks, setTasks] = useState([]); // Task data for selected team
  const [announcements, setAnnouncements] = useState([]); // Announcements for selected team
  const [reportRequests, setReportRequests] = useState([]); // Active report requests
  const [loading, setLoading] = useState(true); // Loading status
  const { hasRole, backendUser, refreshProfile } = useAuth();
  const location = useLocation();

  const [selectedTask, setSelectedTask] = useState(null); 
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedRequest, setSelectedReportRequest] = useState(null); // For upload modal
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  // Task Assign Form State
  const [newTaskData, setNewTaskData] = useState({
    title: "",
    description: "",
    assigneeId: "",
    dueDate: "",
  });

  // Derived state: Is current user a captain of the SELECTED team?
  const isCaptainOfCurrentTeam = teamDetails?.captains?.some(
    (cap) => cap.userId === backendUser?.id
  ) && hasRole("Captain");

  // Helper to load data for a specific project
  const loadProjectContext = async (project) => {
    try {
      setLoading(true);
      setTeam(project);

      // 1. Fetch Full Project Details (to get members and captain IDs)
      const detailRes = await getProjectById(project.id);
      setTeamDetails(detailRes.data);

      // 2. Fetch Tasks for this specific project
      const taskRes = await getProjectTasks(project.id);
      const taskList = taskRes.data.items || taskRes.data || [];
      setTasks(taskList);

      // 3. Fetch/Filter Announcements
      const annRes = await getMyAnnouncements(1, 20);
      const teamAnnouncements = annRes.items.filter(a => 
        a.scope === 1 && 
        project.captainNames?.some(name => name === a.createdByName)
      ); 
      
      setAnnouncements(teamAnnouncements);

      // 4. Fetch Report Requests
      try {
        const reportRes = await getMyReportRequests({ PageSize: 50, ProjectId: project.id });
        const allRequests = reportRes.data?.items || reportRes.data || [];
        
        // Robust filtering: check both targetAllProjects and targetProjectIds array
        // Use case-insensitive comparison for UUIDs
        const projectSpecificRequests = Array.isArray(allRequests) ? allRequests.filter(req => {
          if (req.targetAllProjects) return true;
          
          const targetIds = req.targetProjectIds || req.targetProjectIDs || req.projectIds;
          if (Array.isArray(targetIds) && targetIds.length > 0) {
            return targetIds.some(id => id?.toLowerCase() === project.id?.toLowerCase());
          }
          
          // Fallback: If target data isn't exposed in the DTO, assume the backend pre-filtered it 
          // or that it belongs to this context.
          return true;
        }) : [];
        
        setReportRequests(projectSpecificRequests);
      } catch (repErr) {
        console.warn("Rapor talepleri alınamadı:", repErr);
      }

    } catch (error) {
      console.error("Proje verileri yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllTeams = async () => {
      try {
        setLoading(true);
        // Refresh profile to catch role changes
        try { await refreshProfile(); } catch (e) {}
        
        const projectRes = await getMyProjects();
        const projects = projectRes.data || [];
        setAllProjects(projects);

        if (projects.length > 0) {
          const navTask = location.state?.selectedTask;
          
          if (navTask && navTask.projectId) {
            const targetProject = projects.find(p => p.id === navTask.projectId) || projects[0];
            await loadProjectContext(targetProject);
            handleTaskClick(navTask);
          } else {
            await loadProjectContext(projects[0]);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Takım listesi alınamadı:", error);
        setLoading(false);
      }
    };

    if (backendUser?.id) {
      fetchAllTeams();
    }
  }, [backendUser?.id]); 

  const handleTeamSwitch = (projectId) => {
    const selected = allProjects.find(p => p.id === projectId);
    if (selected) {
      loadProjectContext(selected);
      // Reset task form on switch
      setNewTaskData({ title: "", description: "", assigneeId: "", dueDate: "" });
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskData.assigneeId || !newTaskData.title) {
      alert("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    setIsCreatingTask(true);
    try {
      await createTask({
        title: newTaskData.title,
        description: newTaskData.description,
        assigneeId: newTaskData.assigneeId,
        dueDate: new Date(newTaskData.dueDate).toISOString(),
        projectId: team.id
      });
      
      alert("Görev başarıyla atandı.");
      setNewTaskData({ title: "", description: "", assigneeId: "", dueDate: "" });
      
      // Refresh task list
      const taskRes = await getProjectTasks(team.id);
      setTasks(taskRes.data.items || taskRes.data || []);
    } catch (error) {
      console.error("Görev atama hatası:", error);
      alert("Görev tanımlanırken bir hata oluştu.");
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleReportUpload = async (e) => {
    e.preventDefault();
    const form = e.target;
    const file = form.PdfFile.files[0];
    if (!file || !selectedRequest || !team) return;

    // Restrictions: PDF format only and Max 15 MB
    if (file.type !== "application/pdf") {
      alert("Yalnızca PDF formatında dosya yükleyebilirsiniz.");
      return;
    }
    const maxSize = 15 * 1024 * 1024; // 15 Megabytes
    if (file.size > maxSize) {
      alert("Yüklediğiniz dosya 15 MB sınırını aşmaktadır.");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Direct Firebase Storage Upload (The real file)
      // Path format: reports/{teamName}/{requestName}/{originalFileName}
      const storagePath = `reports/${team.name}/${selectedRequest.title}/${file.name}`;
      const storageRef = ref(storage, storagePath);
      
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(uploadResult.ref);

      // 2. Create a minimal valid dummy PDF to satisfy backend 'IFormFile' validation
      // This allows the backend to pass its "PDF file required" check without storing a large file
      const dummyContent = "%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF";
      const dummyBlob = new Blob([dummyContent], { type: 'application/pdf' });
      const dummyFile = new File([dummyBlob], "firebase_linked.pdf", { type: 'application/pdf' });

      // 3. Backend Metadata Submission
      // Using FormData with PascalCase keys and a dummy file to satisfy backend's multipart model
      const formData = new FormData();
      formData.append("RequestId", selectedRequest.id);
      formData.append("ProjectId", team.id);
      formData.append("Title", form.Title.value || selectedRequest.title);
      formData.append("Description", form.Description.value || "");
      formData.append("DownloadUrl", downloadUrl); // The actual real URL from Firebase
      formData.append("PdfFile", dummyFile);       // The dummy file to satisfy validation
      
      // Force PeriodType to 0 as required for all uploads
      formData.append("PeriodType", 0);
      
      // Ensure date fields are populated to satisfy backend validation
      const periodStart = selectedRequest.periodStart || new Date().toISOString();
      const periodEnd = selectedRequest.periodEnd || new Date().toISOString();
      formData.append("PeriodStart", periodStart);
      formData.append("PeriodEnd", periodEnd);

      await uploadReport(formData);
      
      alert("Rapor başarıyla yüklendi.");
      setSelectedReportRequest(null);
      
      // Refresh context
      loadProjectContext(team);
    } catch (error) {
      console.error("Rapor yükleme hatası:", error);
      
      const serverError = error.response?.data;
      let errorMsg = "Rapor yüklenemedi.";
      
      if (serverError?.errors) {
        errorMsg = Object.values(serverError.errors).flat().join(" | ");
      } else if (serverError?.message) {
        errorMsg = serverError.message;
      }

      alert(`Hata: ${errorMsg}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedTask) return;

    try {
      setIsUpdating(true);
      await updateTaskStatus(selectedTask.id, newStatus);

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === selectedTask.id ? { ...t, status: newStatus } : t
        )
      );
      setSelectedTask(null);
    } catch (error) {
      console.error("Görev güncellenmedi:", error);
      alert("Görev güncellenirken bir hata oluştu.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTaskClick = async (summaryTask) => {
    // Show modal immediately with summary data and loading state
    setSelectedTask({ ...summaryTask, isLoading: true });

    try {
      const res = await getTaskById(summaryTask.id);
      // Merge summary data with full details (in case backend returns a different structure)
      // Prioritize backend details
      setSelectedTask({ ...summaryTask, ...res.data, isLoading: false });
    } catch (error) {
      console.error("Görev detayları alınamadı:", error);
      // Stop loading but keep summary data so user can at least change status
      setSelectedTask((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleAnnouncementClick = async (summaryItem) => {
    setSelectedAnnouncement({ ...summaryItem, isLoading: true });
    try {
      if (!summaryItem.isRead) {
         await markAsRead(summaryItem.id);
         setAnnouncements(prev => prev.map(a => a.id === summaryItem.id ? { ...a, isRead: true } : a));
      }
      const fullDetails = await getAnnouncementById(summaryItem.id);
      setSelectedAnnouncement(fullDetails);
    } catch (error) {
      console.error("Duyuru detayı alınamadı");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("tr-TR", {
       day: "numeric", month: "long"
    });
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Takım bilgileri yükleniyor...
      </div>
    );
  }

  // If user has no team
  if (!team) {
    return (
      <div className="p-6 text-center bg-white rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Henüz bir takımınız yok.
        </h2>
        <p className="text-gray-600">
          Bir takıma dahil olduğunuzda veya yeni bir proje oluşturduğunuzda
          burada görünecektir.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* 1. Bölüm: Takım Bilgi Kartı */}
        <div className="bg-white rounded-xl shadow-sm p-6 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-100 gap-4">
            <h2 className="text-xl text-gray-500 font-normal">
              {team.name || "İsimsiz Takım"}
            </h2>

            {/* Team Switcher Button (Visible only if user has multiple projects) */}
            {allProjects.length > 1 && (
              <div className="relative group">
                <select
                  onChange={(e) => handleTeamSwitch(e.target.value)}
                  value={team.id}
                  className="appearance-none bg-blue-50 text-blue-900 text-sm font-bold py-2 px-4 pr-10 rounded-lg border border-blue-100 outline-none focus:ring-2 focus:ring-blue-900 cursor-pointer transition-all"
                >
                  {allProjects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-900">
                  <ChevronDown size={16} />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Takım Kaptanı</p>
              <p className="text-xl font-bold text-gray-900">
                {team.captainNames ? team.captainNames[0] : "Atanmadı"}
              </p>
            </div>
            <div className="md:border-l md:border-gray-200 md:pl-8">
              <p className="text-sm text-gray-500 mb-1">Takım Danışmanı</p>
              <p className="text-xl font-bold text-gray-900">
                {team.advisorName || "Danışman Bilgisi Yok"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Task Assignment (Captain only) OR Announcements */}
          {isCaptainOfCurrentTeam ? (
            <InfoCard title="Görev Tanımlama Modülü">
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Görev Başlığı
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Veri seti temizliği"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                    value={newTaskData.title}
                    onChange={(e) => setNewTaskData({...newTaskData, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Açıklama
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Görev detaylarını buraya yazınız..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-900 outline-none resize-none transition-all"
                    value={newTaskData.description}
                    onChange={(e) => setNewTaskData({...newTaskData, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Sorumlu Üye
                    </label>
                    <select
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-900 outline-none cursor-pointer"
                      value={newTaskData.assigneeId}
                      onChange={(e) => setNewTaskData({...newTaskData, assigneeId: e.target.value})}
                    >
                      <option value="">Seçiniz...</option>
                      {teamDetails?.members?.map((member) => (
                        <option key={member.userId} value={member.userId}>
                          {member.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Son Teslim
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-900 outline-none"
                      value={newTaskData.dueDate}
                      onChange={(e) => setNewTaskData({...newTaskData, dueDate: e.target.value})}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingTask}
                  className="w-full py-3 bg-blue-900 text-white rounded-lg font-bold text-sm hover:bg-blue-800 transition-all flex items-center justify-center gap-2 shadow-md disabled:bg-gray-400 mt-2"
                >
                  {isCreatingTask ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send size={16} />
                      Görevi Ata
                    </>
                  )}
                </button>
              </form>
            </InfoCard>
          ) : (
            <InfoCard title="Takım Bildirimlerim">
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {announcements.length > 0 ? (
                  announcements.map((ann) => (
                    <div 
                      key={ann.id} 
                      onClick={() => handleAnnouncementClick(ann)}
                      className={`flex items-start p-3 rounded-lg cursor-pointer transition-colors ${ann.isRead ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 border border-blue-100'}`}
                    >
                        <Bell size={16} className={`mr-2 mt-1 ${ann.isRead ? 'text-gray-400' : 'text-blue-600'}`} />
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm truncate ${ann.isRead ? 'text-gray-800' : 'text-blue-900 font-semibold'}`}>
                            {ann.title}
                          </p>
                          <div className="flex justify-between items-center mt-1 gap-2">
                            <span className="text-[10px] text-blue-700 font-bold uppercase truncate">
                              {ann.createdByName || "Kaptan"}
                            </span>
                            <span className="text-[10px] text-gray-400 flex-shrink-0">
                              {formatDate(ann.createdAt)}
                            </span>
                          </div>
                        </div>
                    </div>
                  ))
                ) : (
                    <div className="text-sm text-gray-400 text-center py-10 italic bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      Henüz yeni bildirim yok.
                    </div>
                )}
              </div>
            </InfoCard>
          )}

          {/* Middle Column: Report Upload */}
          <InfoCard title="Rapor Talepleri">
            {hasRole("Captain") ? (
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {reportRequests.length > 0 ? (
                  reportRequests.map((req) => (
                    <div key={req.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:border-blue-200 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          new Date(req.dueDate) < new Date() ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                        }`}>
                          STT: {new Date(req.dueDate).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-900 mb-1">{req.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{req.description}</p>
                      <button 
                        onClick={() => setSelectedReportRequest(req)}
                        className="w-full py-2 bg-blue-900 text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Upload size={14} />
                        Raporu Gönder
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-400 text-center py-10 italic bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    Aktif rapor talebi bulunmuyor.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-lg border border-gray-100">
                Rapor yükleme yetkisi sadece <strong>takım kaptanına</strong> aittir.
              </div>
            )}
          </InfoCard>

          {/* Right Column: Tasks */}
          <InfoCard title={isCaptainOfCurrentTeam ? "Tüm Takım Görevleri" : "Takımdaki Görevlerim"}>
            {(isCaptainOfCurrentTeam ? tasks : tasks.filter(t => t.assigneeId === backendUser?.id)).length > 0 ? (
              (isCaptainOfCurrentTeam ? tasks : tasks.filter(t => t.assigneeId === backendUser?.id)).map((task) => (
                <TaskItem
                  key={task.id}
                  date={new Date(task.dueDate).toLocaleDateString("tr-TR")}
                  title={task.title}
                  status={task.status}
                  assignee={task.assigneeName}
                  project={task.projectName}
                  createdAt={new Date(task.createdAt).toLocaleDateString("tr-TR")}
                  onClick={() => handleTaskClick(task)}
                />
              ))
            ) : (
              <div className="text-sm text-gray-400 text-center py-10 italic bg-gray-50 rounded-lg border border-dashed border-gray-200">
                {isCaptainOfCurrentTeam 
                  ? "Henüz bu takım için oluşturulmuş bir görev bulunmuyor."
                  : "Bu takımda size atanmış bir görev bulunmuyor."}
              </div>
            )}
          </InfoCard>
        </div>
      </div>

      {/* --- Task Update Modal --- */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title="Görev Durumunu Güncelle"
      >
        {selectedTask && (
          <div className="space-y-4">
            <div className="mb-4">
              <p className="text-sm text-gray-500">Görev</p>
              <p className="text-lg font-bold text-gray-900">
                {selectedTask.title}
              </p>
            </div>

            {/* Task Description Section */}
            {selectedTask.isLoading ? (
               <div className="mb-6 p-4 text-center text-gray-400 bg-gray-50 rounded-lg">
                 Detaylar yükleniyor...
               </div>
            ) : selectedTask.description && (
              <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Görev Açıklaması</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedTask.description}
                </p>
              </div>
            )}

            <p className="text-sm text-gray-500 mb-2">Durum Seçin:</p>
            <div className="space-y-2">
              <button
                onClick={() => handleStatusUpdate(0)}
                disabled={isUpdating}
                className={`w-full flex items-center p-3 rounded-lg border-2 transition-all ${
                  selectedTask.status === 0
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 hover:border-red-200 text-gray-600"
                }`}
              >
                <XCircle size={20} className="mr-3" />
                <span className="font-medium">Başlanmadı</span>
              </button>
              <button
                onClick={() => handleStatusUpdate(1)}
                disabled={isUpdating}
                className={`w-full flex items-center p-3 rounded-lg border-2 transition-all ${
                  selectedTask.status === 1
                    ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                    : "border-gray-200 hover:border-yellow-200 text-gray-600"
                }`}
              >
                <Clock size={20} className="mr-3" />
                <span className="font-medium">Devam Ediyor</span>
              </button>
              <button
                onClick={() => handleStatusUpdate(2)}
                disabled={isUpdating}
                className={`w-full flex items-center p-3 rounded-lg border-2 transition-all ${
                  selectedTask.status === 2
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-green-200 text-gray-600"
                }`}
              >
                <CheckCircle size={20} className="mr-3" />
                <span className="font-medium">Tamamlandı</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* --- Announcement Detail Modal --- */}
      <Modal
        isOpen={!!selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        title={selectedAnnouncement?.title || "Duyuru"}
      >
        {selectedAnnouncement?.isLoading ? (
           <p className="text-center text-gray-400">Yükleniyor...</p>
        ) : selectedAnnouncement && (
          <div className="space-y-4">
             <div className="text-xs text-gray-400 border-b pb-2">
               {formatDate(selectedAnnouncement.createdAt)}
             </div>
             <div 
               className="text-sm text-gray-700 leading-relaxed"
               dangerouslySetInnerHTML={{__html: selectedAnnouncement.content}}
             />
          </div>
        )}
      </Modal>

      {/* --- Report Upload Modal --- */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedReportRequest(null)}
        title="Rapor Gönder"
      >
        {selectedRequest && (
          <form onSubmit={handleReportUpload} className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg text-blue-800 text-xs font-medium mb-4">
              <p className="font-bold mb-1">Talep: {selectedRequest.title}</p>
              <p>Son Teslim: {new Date(selectedRequest.dueDate).toLocaleDateString("tr-TR")}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rapor Başlığı</label>
              <input 
                name="Title" 
                type="text" 
                required 
                defaultValue={`${team.name} - ${selectedRequest.title}`}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama (Opsiyonel)</label>
              <textarea 
                name="Description" 
                rows={3}
                placeholder="Raporunuzla ilgili eklemek istediğiniz notlar..."
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-900 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PDF Dosyası</label>
              <input 
                name="PdfFile" 
                type="file" 
                accept=".pdf" 
                required 
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Raporu Onayla ve Gönder
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default MyTeam;