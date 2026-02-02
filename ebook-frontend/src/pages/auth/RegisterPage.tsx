import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { RegisterForm } from '../../components/forms/RegisterForm/RegisterForm';
import { UserPlus } from 'lucide-react';
import styles from '../../components/forms/AuthForms.module.css';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSuccess = (response: any) => {
        
        login(response);

        setTimeout(() => {
            navigate('/');
        }, 1500);
    };

    return (
        <div className={styles.formPageWrapper}>
            <div className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Bilgi <br />
                        Paylaştıkça <br />
                        Çoğalır.
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Kendi dijital kütüphaneni kur, okuma listelerini yönet ve okuma alışkanlıklarını takip et.
                        Hemen ücretsiz hesabını oluştur ve aramıza katıl.
                    </p>
                </div>
            </div>

            <div className={styles.formContainer}>
                <div className={styles.formCard}>
                    <div className={styles.formHeader}>
                        <div className={styles.formIconWrapper}>
                            <UserPlus className={styles.formIcon} />
                        </div>
                        <h1 className={styles.formTitle}>Aramıza Katıl</h1>
                        <p className={styles.formSubtitle}>Yeni bir hesap oluştur ve hemen okumaya başla.</p>
                    </div>

                    <RegisterForm onSuccess={handleSuccess} />

                    <div className={styles.formFooter}>
                        <p className={styles.formFooterText}>
                            Zaten bir hesabın var mı?{' '}
                            <Link to="/login" className={styles.formFooterLink}>
                                Giriş Yap
                            </Link>
                        </p>
                    </div>

                    <p className={styles.formInfo}>
                        Kayıt olarak{' '}
                        <a href="#" className={styles.formInfoLink}>
                            Kullanım Koşullarını
                        </a>{' '}
                        ve{' '}
                        <a href="#" className={styles.formInfoLink}>
                            Gizlilik Politikasını
                        </a>{' '}
                        kabul etmiş olursun.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
