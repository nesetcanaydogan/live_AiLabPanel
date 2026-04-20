import React from "react";
import { Shield, Lock, FileText, Award, AlertCircle, Info, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TermsSection from "../components/TermsSection";

const TermsPage = () => {
  const navigate = useNavigate();
  const lastUpdated = "6 Mart 2026";

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Shield className="text-blue-900" size={32} />
            Kullanım Koşulları
          </h1>
          <p className="text-sm text-gray-500 mt-2 italic">
            Son Güncelleme: {lastUpdated}
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-blue-900 hover:text-blue-700 transition-colors bg-blue-50 px-4 py-2 rounded-lg"
        >
          <ArrowLeft size={16} />
          Geri Dön
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
        
        <TermsSection title="1. Genel Bakış ve Kabul" icon={Info}>
          <p>
            Bu belge, <strong>KTUN AI LAB Yapay Zeka ve Veri Bilimi Laboratuvarı</strong> bünyesinde geliştirilen ve işletilen 
            "AI LAB Super App" platformunun kullanım şartlarını belirler. Uygulamaya giriş yaparak, kayıt olarak 
            veya platformun herhangi bir modülünü kullanarak bu koşulları peşinen kabul etmiş sayılırsınız.
          </p>
          <p>
            Laboratuvar yönetimi, işleyiş gereksinimleri doğrultusunda bu metni önceden haber vermeksizin güncelleme hakkını saklı tutar.
          </p>
        </TermsSection>

        <TermsSection title="2. Hesap Güvenliği ve Yetkilendirme" icon={Lock}>
          <p>
            Sistemimiz <strong>Firebase Authentication</strong> tabanlı bir 
            güvenlik modeli kullanmaktadır. Kullanıcılar, giriş bilgilerinin gizliliğinden bizzat sorumludur.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Hesabınızın izinsiz kullanımından doğacak sorumluluk kullanıcıya aittir.</li>
            <li>Sistemdeki roller (Admin, Kaptan, Üye) sadece yetkili yöneticiler tarafından atanabilir.</li>
            <li>Güvenlik yamaları ve token yenileme işlemleri, veri bütünlüğünü korumak adına otomatik olarak gerçekleştirilir.</li>
          </ul>
        </TermsSection>

        <TermsSection title="3. Veri Gizliliği ve Depolama" icon={Shield}>
          <p>
            Verileriniz modern şifreleme standartları ile <strong>PostgreSQL</strong> veri tabanında, medya dosyalarınız 
            (Profil resimleri, PDF Raporlar) ise <strong>Firebase Cloud Storage</strong> üzerinde barındırılır.
          </p>
          <p>
            Yüklenen her dosya, laboratuvarın hiyerarşik dizin yapısına (.reports/{`{proje_adi}`}/...) uygun olarak saklanır ve 
            erişim izinleri yetkilendirme matrisine göre kısıtlanır. Hassas verileriniz üçüncü taraflarla paylaşılmaz.
          </p>
        </TermsSection>

        <TermsSection title="4. Proje ve Raporlama Sorumlulukları" icon={FileText}>
          <p>
            Takım Kaptanları, atanan rapor taleplerini zamanında ve PDF formatında sisteme yüklemekle yükümlüdür. 
            Versiyonlama sistemi sayesinde sadece en son yüklenen rapor geçerli kabul edilir.
          </p>
          <p>
            Yanlış, yanıltıcı veya uygunsuz içerik barındıran raporların yüklenmesi disiplin cezası ve sistem erişiminin 
            kısıtlanmasına yol açabilir.
          </p>
        </TermsSection>

        <TermsSection title="5. Puanlama (Scoring) Sistemi" icon={Award}>
          <p>
            Sistemde yer alan <strong>Scoring System</strong>, kullanıcıların laboratuvar içi faaliyetlerini, 
            görev tamamlamalarını ve disiplin kurallarına uyumlarını takip eder.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Görevlerin tamamlanması halinde yöneticiler tarafından puan çarpanı uygulanabilir.</li>
            <li>Raporların son teslim tarihini geçmesi durumunda, sistem tarafından ilgili projenin tüm üyelerine otomatik ceza puanı uygulanır.</li>
            <li>Puanlar, laboratuvar içi performans değerlendirmelerinde temel kriterlerden biri olarak kabul edilir.</li>
          </ul>
        </TermsSection>

        <TermsSection title="6. Fesih ve Kısıtlama" icon={AlertCircle}>
          <p>
            Laboratuvar kurallarına veya bu kullanım koşullarına aykırı hareket eden kullanıcıların hesapları, 
            yöneticiler tarafından dondurulabilir veya kalıcı olarak silinebilir.
          </p>
        </TermsSection>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400">
            AI LAB Super App &copy; 2026 | Tüm hakları AI Lab'a aittir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
