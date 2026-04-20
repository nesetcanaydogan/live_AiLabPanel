import React, { useState, useEffect } from "react";
import {
  Users,
  ArrowRight,
  Edit2,
  Check,
  UploadCloud,
  Settings,
  Shield,
  Phone
} from "lucide-react";
import { useAuth } from "../context/AuthContent";
import { useNavigate } from "react-router-dom";
import {
  updateProfileImage,
  getDefaultAvatars,
  getUserById,
} from "../services/api";
import Modal from "../components/Modal";
import Leaderboard from "../components/Leaderboard";
import UpdateEmail from "../components/profile/UpdateEmail";
import UpdatePassword from "../components/profile/UpdatePassword";
import UpdatePhone from "../components/profile/UpdatePhone";
import { compressAndConvertToWebp } from "../utils/imageUtils";
import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ProfilePage = () => {
  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("defaults");
  const [systemAvatars, setSystemAvatars] = useState([]);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [activeSettingsTab, setActiveSettingsTab] = useState("email"); // email | password | phone

  const { logout, user, hasRole } = useAuth();
  const navigate = useNavigate();

  // Fetch full user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserById();
        setProfileData(res.data);
      } catch (error) {
        console.error("Profil verisi çekilemedi:", error);
      }
    };
    fetchProfile();
  }, []);

  // Get system avatars when Modal opens
  useEffect(() => {
    if (isModalOpen) {
      const fetchDefaults = async () => {
        try {
          const res = await getDefaultAvatars();
          setSystemAvatars(res.data.avatarUrls || []);
        } catch (error) {
          console.error("Sistem avatarları çekilemedi:", error);
        }
      };
      fetchDefaults();
    }
  }, [isModalOpen]);

  // File Upload and Process
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 5MB Limit Control
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("Yüklenen dosya boyutu 5MB'dan büyük olamaz!");
      return;
    }

    try {
      setIsSaving(true);
      const compressedFile = await compressAndConvertToWebp(file);
      const storageRef = ref(storage, `profile_images/${user.uid}/avatar.webp`); // Use uid from firebase auth
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setSelectedAvatarUrl(downloadURL);
      setActiveTab("upload");
    } catch (error) {
      console.error("Dosya yükleme hatası:", error);
      alert("Fotoğraf yüklenirken bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFinal = async () => {
    if (!selectedAvatarUrl) return;

    try {
      setIsSaving(true);
      await updateProfileImage(selectedAvatarUrl);
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Profil güncellenemedi:", error);
      alert("Profil güncellenirken hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 lg:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Profilim
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Ad Soyad</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {profileData ? profileData.fullName : user?.displayName || "..."}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                Ai Lab Puanı
              </p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {profileData ? profileData.totalScore : "..."}
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid Layout: 2fr (Left) - 1fr (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN (2/3): Profile Actions & Settings */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Picture Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div
                className="relative group cursor-pointer flex-shrink-0"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-md group-hover:border-blue-100 transition-all">
                  {profileData && profileData.profileImageUrl ? (
                    <img
                      src={profileData.profileImageUrl}
                      alt="Profil"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = "/Group-1.png"; }}
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-900 flex items-center justify-center text-white text-4xl font-bold">
                      {profileData?.fullName?.charAt(0) || user?.email?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit2 size={16} />
                </div>
              </div>
              
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-gray-900">
                  {profileData?.fullName || "Kullanıcı"}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
                
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <button onClick={() => setActiveSettingsTab("email")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeSettingsTab === 'email' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    <Settings size={16} /> E-Posta
                  </button>
                  <button onClick={() => setActiveSettingsTab("password")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeSettingsTab === 'password' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    <Shield size={16} /> Şifre
                  </button>
                  <button onClick={() => setActiveSettingsTab("phone")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeSettingsTab === 'phone' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    <Phone size={16} /> Telefon
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Settings Forms */}
            <div className="transition-all duration-300">
              {activeSettingsTab === "email" && <UpdateEmail />}
              {activeSettingsTab === "password" && <UpdatePassword />}
              {activeSettingsTab === "phone" && <UpdatePhone />}
            </div>

            {/* Logout Button */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <button
                type="button"
                onClick={logout}
                className="w-full text-left flex items-center text-red-600 hover:text-red-700 font-bold transition-colors"
              >
                ÇIKIŞ YAP <ArrowRight size={20} className="ml-2" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN (1/3): Leaderboard Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users size={20} className="text-blue-900" />
                Lider Tablosu
              </h3>
              {/* Leaderboard Component - compact view */}
              <div className="overflow-x-auto">
                <Leaderboard /> 
              </div>
            </div>

            {/* Admin Quick Access Button */}
            {hasRole("Admin") && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-50">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Yönetim</h4>
                <button 
                  onClick={() => navigate("/admin")}
                  className="w-full py-4 bg-blue-900 text-white rounded-xl font-black text-sm hover:bg-blue-800 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-900/20 shadow-blue-900/10"
                >
                  <Shield size={20} />
                  YÖNETİCİ PANELİ
                </button>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Avatar Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Profil Fotoğrafını Değiştir"
      >
        <div className="flex border-b border-gray-100 mb-4">
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "defaults"
                ? "text-blue-900 border-b-2 border-blue-900"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("defaults")}
          >
            Hazır Avatarlar
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "upload"
                ? "text-blue-900 border-b-2 border-blue-900"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("upload")}
          >
            Fotoğraf Yükle
          </button>
        </div>

        {activeTab === "defaults" && (
          <div className="grid grid-cols-3 gap-3 mb-6 max-h-60 overflow-y-auto p-1">
            {systemAvatars.map((url, index) => (
              <div
                key={index}
                onClick={() => setSelectedAvatarUrl(url)}
                className={`relative cursor-pointer rounded-full overflow-hidden border-2 transition-all aspect-square
                  ${
                    selectedAvatarUrl === url
                      ? "border-blue-900 ring-2 ring-blue-100"
                      : "border-transparent hover:border-gray-200"
                  }
                `}
              >
                <img src={url} alt={`Avatar ${index}`} className="w-full h-full object-cover" />
                {selectedAvatarUrl === url && (
                  <div className="absolute inset-0 bg-blue-900 bg-opacity-20 flex items-center justify-center">
                    <Check className="text-white" size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "upload" && (
          <div className="flex flex-col items-center justify-center mb-6 py-4">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-50 transition-colors">
              <UploadCloud size={32} className="text-blue-900" />
              <span className="mt-2 text-sm leading-normal text-gray-600">
                Dosya Seç (Max 5MB)
              </span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
            {selectedAvatarUrl && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 mb-2">Seçilen Görsel</p>
                <img src={selectedAvatarUrl} alt="Önizleme" className="w-24 h-24 rounded-full object-cover border-2 border-blue-900 mx-auto" />
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleSaveFinal}
          disabled={!selectedAvatarUrl || isSaving}
          className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
            !selectedAvatarUrl || isSaving ? "bg-gray-300 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-800"
          }`}
        >
          {isSaving ? "İşleniyor..." : "Kaydet ve Güncelle"}
        </button>
      </Modal>
    </>
  );
};

export default ProfilePage;