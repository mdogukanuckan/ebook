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
        <div className={`${styles.formContainer} ${styles.login}`}>
            <div className={styles.formCard}>
                {/* Header */}
                <div className={styles.formHeader}>
                    <div className={`${styles.formIconWrapper} ${styles.login}`}>
                        <LogIn className={styles.formIcon} />
                    </div>
                    <h1 className={styles.formTitle}>Hoş Geldiniz</h1>
                    <p className={styles.formSubtitle}>eBook Kütüphanesine giriş yapın</p>
                </div>

                {/* Login Form Component */}
                <LoginForm onSuccess={handleSuccess} />

                {/* Footer */}
                <div className={styles.formFooter}>
                    <p className={styles.formFooterText}>
                        Hesabınız yok mu?{' '}
                        <Link to="/register" className={`${styles.formFooterLink} ${styles.login}`}>
                            Kayıt Olun
                        </Link>
                    </p>
                </div>
            </div>

            {/* Additional Info */}
            <p className={styles.formInfo}>
                Giriş yaparak{' '}
                <a href="#" className={styles.formInfoLink}>
                    Kullanım Koşullarını
                </a>{' '}
                kabul etmiş olursunuz.
            </p>
        </div>
    );
};

export default LoginPage;
