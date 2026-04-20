import React, { useState } from "react";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Validation: Match check
    if (newPassword !== confirmNewPassword) {
      setMessage({ 
        type: "error", 
        text: "Yeni şifreler birbiri ile uyuşmamaktadır. Şifre değiştirme işlemi başarısız." 
      });
      return;
    }

    setLoading(true);
    const user = auth.currentUser;

    if (!user) return;

    try {
      // 1. Re-authenticate
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // 2. Update Firebase Password
      await updatePassword(user, newPassword);

      setMessage({ type: "success", text: "Şifre başarıyla güncellendi." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error("Update password error:", error);
      setMessage({ type: "error", text: "Güncelleme başarısız. Mevcut şifrenizi kontrol edin." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Şifre Değiştir</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Mevcut Şifre</label>
          <input 
            type="password" 
            required 
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Yeni Şifre (6+ karakter)</label>
            <input 
              type="password" 
              required 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Yeni Şifre Onay</label>
            <input 
              type="password" 
              required 
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 disabled:bg-gray-400 transition-colors"
        >
          {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
