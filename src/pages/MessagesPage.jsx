import React, { useState, useEffect } from "react";
import { Send, Users, User, Globe, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContent";
import { 
  getAllUsers, 
  getAllProjects, 
  getMyProjects, 
  getProjectById 
} from "../services/api";
import { createAnnouncement } from "../services/announcementService";
import { useNavigate } from "react-router-dom";

const MessagesPage = () => {
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const isAdmin = hasRole("Admin");
  const isCaptain = hasRole("Captain");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    scope: 1, // Default to Project scope
    targetProjectIds: [],
    targetUserIds: [],
  });

  // Resources State
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Security Redirect: Only Admins and Captains allowed
  useEffect(() => {
    // We allow a small delay for backendUser to load in AuthContext
    // but the loading state in AuthContext handles most cases.
    if (!isAdmin && !isCaptain) {
      const timer = setTimeout(() => {
        if (!isAdmin && !isCaptain) {
          navigate("/dashboard");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAdmin, isCaptain, navigate]);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        if (isAdmin) {
          // Admins can see everything
          const [projRes, userRes] = await Promise.all([
            getAllProjects({ PageSize: 1000 }),
            getAllUsers({ PageSize: 1000 })
          ]);
          setProjects(projRes.data?.items || projRes.data || []);
          setUsers(userRes.data?.items || userRes.data || []);
        } else if (isCaptain) {
          // Captains only see their projects
          const projRes = await getMyProjects();
          const captainProjects = projRes.data || [];
          setProjects(captainProjects);

          // If they have projects, fetch all members of all their projects for individual scope
          if (captainProjects.length > 0) {
            const memberPromises = captainProjects.map(p => getProjectById(p.id));
            const memberResults = await Promise.all(memberPromises);
            const allMembers = memberResults.flatMap(r => r.data?.members || []);
            // Unique members only based on userId
            const uniqueMembers = Array.from(new Map(allMembers.map(m => [m.userId, m])).values());
            setUsers(uniqueMembers);
          }
        }
      } catch (error) {
        console.error("Kaynaklar yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin || isCaptain) {
      fetchResources();
    }
  }, [isAdmin, isCaptain]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!formData.title || !formData.content) {
      alert("Lütfen başlık ve mesaj içeriğini doldurun.");
      return;
    }

    if (formData.scope === 1 && formData.targetProjectIds.length === 0) {
      alert("Lütfen en az bir hedef takım seçin.");
      return;
    }

    if (formData.scope === 2 && formData.targetUserIds.length === 0) {
      alert("Lütfen en az bir hedef kullanıcı seçin.");
      return;
    }

    setIsSending(true);
    try {
      await createAnnouncement({
        title: formData.title,
        content: formData.content,
        scope: Number(formData.scope),
        targetProjectIds: formData.scope === 1 ? formData.targetProjectIds : [],
        targetUserIds: formData.scope === 2 ? formData.targetUserIds : [],
      });

      alert("Mesaj başarıyla gönderildi.");
      setFormData({
        title: "",
        content: "",
        scope: 1,
        targetProjectIds: [],
        targetUserIds: [],
      });
    } catch (error) {
      console.error("Gönderme hatası:", error);
      alert("Mesaj gönderilirken bir hata oluştu.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCheckboxChange = (id, field) => {
    setFormData(prev => {
      const current = prev[field];
      const updated = current.includes(id) 
        ? current.filter(item => item !== id)
        : [...current, id];
      return { ...prev, [field]: updated };
    });
  };

  if (!isAdmin && !isCaptain) return null;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-900 p-6 text-white text-center sm:text-left">
          <h2 className="text-2xl font-bold flex items-center justify-center sm:justify-start gap-3">
            <Send size={28} />
            Mesaj Gönderim Merkezi
          </h2>
          <p className="text-blue-100 text-sm mt-1 opacity-80">
            Duyuru, bilgilendirme veya özel mesajlarınızı buradan iletebilirsiniz.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Scope Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isAdmin && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, scope: 0 })}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  formData.scope === 0 ? "border-blue-900 bg-blue-50 text-blue-900" : "border-gray-100 text-gray-500 hover:border-blue-200"
                }`}
              >
                <Globe size={24} className="mb-2" />
                <span className="text-sm font-bold">Genel Duyuru</span>
                <span className="text-[10px] opacity-70 text-center">Tüm Üyeler</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, scope: 1 })}
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                formData.scope === 1 ? "border-blue-900 bg-blue-50 text-blue-900" : "border-gray-100 text-gray-500 hover:border-blue-200"
              }`}
            >
              <Users size={24} className="mb-2" />
              <span className="text-sm font-bold">Takım Mesajı</span>
              <span className="text-[10px] opacity-70 text-center">Belirli Projeler</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, scope: 2 })}
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                formData.scope === 2 ? "border-blue-900 bg-blue-50 text-blue-900" : "border-gray-100 text-gray-500 hover:border-blue-200"
              }`}
            >
              <User size={24} className="mb-2" />
              <span className="text-sm font-bold">Kişisel Mesaj</span>
              <span className="text-[10px] opacity-70 text-center">Bireysel Üyeler</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Mesaj Başlığı
              </label>
              <input
                type="text"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                placeholder="Örn: Hafta Sonu Laboratuvar Erişimi Hakkında"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Target Selection Logic */}
            {formData.scope === 1 && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Hedef Takımlar ({formData.targetProjectIds.length})
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200 custom-scrollbar">
                  {projects.map(proj => (
                    <label key={proj.id} className="flex items-center space-x-3 p-2 hover:bg-white rounded-md cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-blue-900"
                        checked={formData.targetProjectIds.includes(proj.id)}
                        onChange={() => handleCheckboxChange(proj.id, "targetProjectIds")}
                      />
                      <span className="text-sm font-medium text-gray-700">{proj.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {formData.scope === 2 && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Hedef Üyeler ({formData.targetUserIds.length})
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200 custom-scrollbar">
                  {users.map(u => (
                    <label key={u.userId || u.id} className="flex items-center space-x-3 p-2 hover:bg-white rounded-md cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-blue-900"
                        checked={formData.targetUserIds.includes(u.userId || u.id)}
                        onChange={() => handleCheckboxChange(u.userId || u.id, "targetUserIds")}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {u.fullName} <span className="text-[10px] text-gray-400 ml-1">({u.email})</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Mesaj İçeriği (HTML Desteklenir)
              </label>
              <textarea
                rows={6}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-900 outline-none resize-none transition-all font-sans"
                placeholder="Mesajınızı buraya detaylıca yazınız..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
              <p className="text-[10px] text-gray-400 mt-2 italic flex items-center gap-1">
                <AlertCircle size={12} />
                Mesaj içeriğinde temel HTML etiketlerini (b, i, ul, p) kullanabilirsiniz. <b>[*WEB PLATFORMUNDA İŞLEVSEL]</b>
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSending || loading}
              className={`w-full py-4 rounded-xl font-black text-white flex items-center justify-center gap-3 transition-all shadow-lg ${
                isSending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-800 hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              {isSending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  GÖNDERİLİYOR...
                </>
              ) : (
                <>
                  <Send size={20} />
                  MESAJI YAYINLA
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessagesPage;
