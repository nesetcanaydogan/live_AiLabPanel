import React, { useState } from "react";
import { useAuth } from "../../context/AuthContent";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    studentId: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      setLoading(false);
      return;
    }

    try {
      // 1. Firebase Registration
      const userCredential = await register(formData.email, formData.password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      // 2. Sync with Backend
      // Using the dedicated endpoint for Firebase auth sync
      await axiosInstance.post("api/Auth/login-firebase", {
        idToken: idToken,
        fullName: formData.fullName,
        schoolNumber: formData.studentId, // Ensure API expects this field mapping
        phoneNumber: formData.phone
      });

      // Redirect
      navigate("/dashboard");

    } catch (err) {
      console.error("Registration error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Bu e-posta adresi zaten kullanımda.");
      } else {
        setError("Kayıt işlemi başarısız. Lütfen bilgilerinizi kontrol edin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 text-red-600 rounded text-sm">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
        <input 
          type="text" 
          name="fullName" 
          required 
          className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-900"
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Öğrenci No</label>
          <input 
            type="text" 
            name="studentId" 
            required 
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-900"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Telefon</label>
          <input 
            type="tel" 
            name="phone" 
            required 
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-900"
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">E-Posta</label>
        <input 
          type="email" 
          name="email" 
          required 
          className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-900"
          onChange={handleChange}
        />
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">Şifre</label>
        <input 
          type={showPassword ? "text" : "password"} 
          name="password" 
          required 
          className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-900"
          onChange={handleChange}
        />
        <button 
          type="button"
          className="absolute right-3 top-9 text-gray-400"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Şifre Tekrar</label>
        <input 
          type="password" 
          name="confirmPassword" 
          required 
          className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-900"
          onChange={handleChange}
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors disabled:bg-gray-400"
      >
        {loading ? "Kaydediliyor..." : "Kayıt Ol"}
      </button>
    </form>
  );
};

export default RegisterForm;
