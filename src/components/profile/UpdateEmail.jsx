import React, { useState } from "react";
import { updateEmail, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import axiosInstance from "../../utils/axiosInstance";

const UpdateEmail = () => {
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState(""); // Needed for re-auth
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const user = auth.currentUser;

    if (!user) return;

    try {
      // 1. Re-authenticate (Security Requirement)
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // 2. Update Firebase Email
      await updateEmail(user, newEmail);

      // 3. Sync with Backend
      await axiosInstance.put("api/profile/update-email", { email: newEmail });

      setMessage({ type: "success", text: "E-posta başarıyla güncellendi." });
      setNewEmail("");
      setPassword("");
    } catch (error) {
      console.error("Update email error:", error);
      setMessage({ type: "error", text: "Güncelleme başarısız. Şifrenizi kontrol edin." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">E-Posta Değiştir</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Yeni E-Posta</label>
          <input 
            type="email" 
            required 
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mevcut Şifre (Güvenlik İçin)</label>
          <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-900"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 disabled:bg-gray-400"
        >
          {loading ? "Güncelleniyor..." : "E-Postayı Güncelle"}
        </button>
      </form>
    </div>
  );
};

export default UpdateEmail;
