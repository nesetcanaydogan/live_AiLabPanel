import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { AlertTriangle, Send, Loader2 } from "lucide-react";
import Modal from "./Modal"; // Reusing your existing Modal component
import { reportBug } from "../services/api";

const BugReportModal = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bugType: 1, // Default: Visual
    description: "",
  });
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  const BUG_TYPES = [
    { id: 1, label: "Görsel Hata (Visual)" },
    { id: 2, label: "Fonksiyonel Hata (Functional)" },
    { id: 3, label: "Performans Sorunu (Performance)" },
    { id: 4, label: "Çökme / Kilitlenme (Crash)" },
    { id: 5, label: "Yetki / Erişim Sorunu (Auth)" },
    { id: 99, label: "Diğer" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      setMessage({ type: "error", text: "Lütfen sorunu detaylıca açıklayın." });
      return;
    }

    setLoading(true);
    setMessage(null);

    const payload = {
      platform: 1, // Web
      bugType: Number(formData.bugType),
      pageInfo: location.pathname, // Current route
      description: formData.description,
    };

    try {
      await reportBug(payload);
      setMessage({ type: "success", text: "Geri bildiriminiz alındı. Teşekkürler!" });
      setFormData({ bugType: 1, description: "" });
      
      // Close after a short delay to show success message
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 2000);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        setMessage({ 
          type: "error", 
          text: "Çok fazla istek gönderdiniz. Lütfen 30 saniye bekleyin." 
        });
      } else {
        setMessage({ 
          type: "error", 
          text: "Rapor gönderilirken bir hata oluştu." 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hata Bildir">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Info Banner */}
        <div className="bg-blue-50 p-3 rounded-lg flex items-start space-x-3">
          <AlertTriangle className="text-blue-600 flex-shrink-0" size={20} />
          <p className="text-sm text-blue-800">
            Karşılaştığınız hatayı bize bildirin. Sayfa bilgisi ({location.pathname}) otomatik eklenecektir.
          </p>
        </div>

        {/* Bug Type Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hata Türü
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
            value={formData.bugType}
            onChange={(e) => setFormData({ ...formData, bugType: e.target.value })}
            disabled={loading}
          >
            {BUG_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Açıklama
          </label>
          <textarea
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-900 outline-none resize-none"
            placeholder="Ne yaparken hata aldınız? Beklenen neydi?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={loading}
          />
        </div>

        {/* Message Area */}
        {message && (
          <div className={`p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center space-x-2 transition-all ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-800 shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Gönderiliyor...</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>Raporu Gönder</span>
            </>
          )}
        </button>
      </form>
    </Modal>
  );
};

export default BugReportModal;
