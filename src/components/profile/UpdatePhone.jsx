import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const UpdatePhone = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Direct API call - No Firebase auth update needed for phone usually unless using Phone Auth provider
      await axiosInstance.put("api/profile/update-phone", { phoneNumber: phone });

      setMessage({ type: "success", text: "Telefon numarası güncellendi." });
      setPhone("");
    } catch (error) {
      console.error("Update phone error:", error);
      setMessage({ type: "error", text: "Güncelleme başarısız." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Telefon Numarası Güncelle</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Yeni Telefon Numarası</label>
          <input 
            type="tel" 
            required 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-900"
            placeholder="05XX XXX XX XX"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 disabled:bg-gray-400"
        >
          {loading ? "Güncelleniyor..." : "Numarayı Kaydet"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePhone;
