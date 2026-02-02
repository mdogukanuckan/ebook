import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from '../../components/forms//LoginForm/LoginForm';
import { LogIn } from 'lucide-react';
import styles from '../../components/forms/AuthForms.module.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSuccess = (response: any) => {
        login(response);
        navigate('/');
    };

    return (
        <div className={styles.formPageWrapper}>
            {/* Left Side: Hero Section */}
            <div className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Okuma <br />
                        Yolculuğuna <br />
                        Başla.
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Binlerce kitap, sınırsız bilgi ve keyifli bir okuma deneyimi seni bekliyor.
                        Topluluğumuza katıl ve kütüphaneni oluşturmaya başla.
                    </p>
                </div>
            </div>

            {/* Right Side: Form Section */}
            <div className={styles.formContainer}>
                <div className={styles.formCard}>
                    {/* Header */}
                    <div className={styles.formHeader}>
                        <div className={styles.formIconWrapper}>
                            <LogIn className={styles.formIcon} />
                        </div>
                        <h1 className={styles.formTitle}>Tekrar Hoş Geldin</h1>
                        <p className={styles.formSubtitle}>Hesabına güvenli bir şekilde giriş yap.</p>
                    </div>

                    {/* Login Form Component */}
                    <LoginForm onSuccess={handleSuccess} />

                    {/* Footer */}
                    <div className={styles.formFooter}>
                        <p className={styles.formFooterText}>
                            Henüz bir hesabın yok mu?{' '}
                            <Link to="/register" className={styles.formFooterLink}>
                                Ücretsiz Kayıt Ol
                            </Link>
                        </p>
                    </div>

                    {/* Additional Info */}
                    <p className={styles.formInfo}>
                        Giriş yaparak{' '}
                        <a href="#" className={styles.formInfoLink}>
                            Kullanım Koşullarını
                        </a>{' '}
                        ve gizlilik politikasını kabul etmiş olursun.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
