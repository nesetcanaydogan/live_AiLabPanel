import React, { useState } from "react";
import { useAuth } from "../../context/AuthContent";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Firebase Login
      // This automatically updates the AuthContext state via onIdTokenChanged
      const userCredential = await login(formData.email, formData.password);
      const user = userCredential.user;
      
      // 2. Sync with Backend (Optional but good for initializing session data/claims on server)
      // We send the ID token to let backend validate and set cookies/claims if needed
      // Note: Standard Firebase apps might rely purely on the token in headers, 
      // but if your legacy backend needs a "login" signal, this is it.
      const idToken = await user.getIdToken();
      
      await axiosInstance.post("api/Auth/login-firebase", {
        idToken: idToken
      });

      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("E-posta veya şifre hatalı.");
      } else {
        setError("Giriş yapılamadı. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Lütfen önce e-posta adresinizi girin.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, formData.email);
      alert("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Şifre sıfırlama e-postası gönderilemedi.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {error && <div className="p-3 bg-red-50 text-red-600 rounded text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700">E-Posta</label>
        <input 
          type="email" 
          name="email" 
          required 
          className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-900"
          onChange={handleChange}
        />
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">Şifre</label>
        <input 
          type={showPassword ? "text" : "password"} 
          name="password" 
          required 
          className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-900"
          onChange={handleChange}
        />
        <button 
          type="button"
          className="absolute right-3 top-10 text-gray-400"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="flex justify-end">
        <button 
          type="button" 
          onClick={handleForgotPassword}
          className="text-sm text-blue-900 hover:underline"
        >
          Şifremi Unuttum
        </button>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-800 transition-colors disabled:bg-gray-400"
      >
        {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
      </button>
    </form>
  );
};

export default LoginForm;
