import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { BookOpen, Lock, User as UserIcon, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import './LoginPage.css'; 


const LoginPage = () => {
  const { login } = useAuth();
  
  // Local State: Sadece bu sayfanın bilmesi gereken geçici veriler.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Sayfanın yenilenmesini engelle (SPA mantığı)
    setIsSubmitting(true);
    setError('');

    try {
      // Merkezi login'i çağır. O arka planda axios ile backend'e gidecek.
      await login({ username, password });
      // Başarılı olursa AuthContext güncellenecek ve App.tsx bizi otomatik içeri alacak.
    } catch (err: any) {
      // Mühendislik Notu: Backend'den gelen 'BusinessException' veya 'Unauthorized' 
      // mesajlarını burada yakalayıp kullanıcıya gösteriyoruz.
      const message = err.response?.data?.message || 'Bağlantı hatası! Lütfen backend sunucunuzun (Port 8080) çalıştığından emin olun.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        
        {/* Logo ve Başlık Bölümü */}
        <div className="login-header">
          <div className="login-logo">
            <BookOpen size={40} />
          </div>
          <h1 className="login-title">Tekrar Hoş Geldin</h1>
          <p className="login-subtitle">E-Kitap dünyasına giriş yap.</p>
        </div>

        {/* Kart Bölümü */}
        <div className="login-card">
          <form onSubmit={handleSubmit} className="login-form">
            
            {/* Kullanıcı Adı Girişi */}
            <div className="form-group">
              <label className="form-label">Kullanıcı Adı</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <UserIcon size={20} />
                </div>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Kullanıcı adınız"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Şifre Girişi */}
            <div className="form-group">
              <div className="label-row">
                <label className="form-label">Şifre</label>
                <button type="button" className="forgot-link">Unuttum?</button>
              </div>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Hata Bildirimi */}
            {error && (
              <div className="error-box">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* Giriş Butonu */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  Sisteme Giriş Yap
                  <ChevronRight size={20} className="arrow-icon" />
                </>
              )}
            </button>
          </form>

          {/* Kayıt Olma Linki */}
          <div className="login-footer">
            <p>
              Henüz hesabın yok mu? <button type="button" className="register-link">Hemen Kaydol</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;