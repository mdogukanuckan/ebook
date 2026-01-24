import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../features/auth/context/authContext';
import userService from '../../services/userService';
import {
    User as UserIcon,
    Lock,
    Save,
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    UserCircle,
    KeyRound
} from 'lucide-react';
import styles from './SettingsPage.module.css';
import type { UserUpdateData, PasswordChangeData } from '../../features/auth/types/auth';

type TabType = 'profile' | 'security';

const SettingsPage = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Profile Form
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        reset: resetProfile,
        formState: { errors: profileErrors }
    } = useForm<UserUpdateData>({
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || ''
        }
    });

    // Password Form
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPassword,
        watch,
        formState: { errors: passwordErrors }
    } = useForm<PasswordChangeData>();

    // User verisi değiştiğinde profil formunu güncelle
    useEffect(() => {
        if (user) {
            resetProfile({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || ''
            });
        }
    }, [user, resetProfile]);

    const onProfileSubmit = async (data: UserUpdateData) => {
        if (!user) return;
        setIsLoading(true);
        setStatus(null);
        try {
            const updatedUser = await userService.updateProfile(user.id, data);
            updateUser(updatedUser);
            setStatus({ type: 'success', message: 'Profil bilgileriniz başarıyla güncellendi.' });
        } catch (error: any) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Profil güncellenirken bir hata oluştu.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onPasswordSubmit = async (data: PasswordChangeData) => {
        if (!user) return;
        setIsLoading(true);
        setStatus(null);
        try {
            await userService.changePassword(user.id, data);
            setStatus({ type: 'success', message: 'Şifreniz başarıyla değiştirildi.' });
            resetPassword();
        } catch (error: any) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Şifre değiştirilirken bir hata oluştu.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.settingsContainer}>
            <div className={styles.settingsHeader}>
                <h1>Ayarlar</h1>
                <p>Hesap bilgilerinizi ve güvenlik tercihlerinizi buradan yönetebilirsiniz.</p>
            </div>

            <div className={styles.settingsLayout}>
                <aside className={styles.sidebar}>
                    <button
                        className={`${styles.navButton} ${activeTab === 'profile' ? styles.active : ''}`}
                        onClick={() => { setActiveTab('profile'); setStatus(null); }}
                    >
                        <UserCircle size={20} />
                        <span>Profil Ayarları</span>
                        <ChevronRight size={16} className={styles.chevron} />
                    </button>
                    <button
                        className={`${styles.navButton} ${activeTab === 'security' ? styles.active : ''}`}
                        onClick={() => { setActiveTab('security'); setStatus(null); }}
                    >
                        <KeyRound size={20} />
                        <span>Güvenlik</span>
                        <ChevronRight size={16} className={styles.chevron} />
                    </button>
                </aside>

                <main className={styles.mainContent}>
                    {status && (
                        <div className={`${styles.statusMessage} ${styles[status.type]}`}>
                            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span>{status.message}</span>
                        </div>
                    )}

                    {activeTab === 'profile' ? (
                        /* Key ekleyerek DOM'u tamamen izole ediyoruz */
                        <section key="profile-tab" className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <UserIcon size={24} />
                                <h2>Profil Bilgileri</h2>
                            </div>
                            <form onSubmit={handleSubmitProfile(onProfileSubmit)} className={styles.form} autoComplete="off">
                                <div className={styles.inputGroup}>
                                    <label>Kullanıcı Adı</label>
                                    <input
                                        type="text"
                                        value={user?.username}
                                        disabled
                                        className={styles.disabledInput}
                                    />
                                    <span className={styles.inputHint}>Kullanıcı adı değiştirilemez.</span>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="firstName">İsim</label>
                                        <input
                                            id="firstName"
                                            {...registerProfile('firstName', { required: 'İsim alanı zorunludur' })}
                                            placeholder="İsminiz"
                                        />
                                        {profileErrors.firstName && <span className={styles.errorText}>{profileErrors.firstName.message}</span>}
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="lastName">Soyisim</label>
                                        <input
                                            id="lastName"
                                            {...registerProfile('lastName', { required: 'Soyisim alanı zorunludur' })}
                                            placeholder="Soyisminiz"
                                        />
                                        {profileErrors.lastName && <span className={styles.errorText}>{profileErrors.lastName.message}</span>}
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="email">E-posta Adresi</label>
                                    <input
                                        id="email"
                                        type="email"
                                        {...registerProfile('email', {
                                            required: 'E-posta alanı zorunludur',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Geçerli bir e-posta adresi giriniz'
                                            }
                                        })}
                                        autoComplete="email"
                                    />
                                    {profileErrors.email && <span className={styles.errorText}>{profileErrors.email.message}</span>}
                                </div>

                                <button type="submit" className={styles.saveButton} disabled={isLoading}>
                                    <Save size={20} />
                                    <span>{isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
                                </button>
                            </form>
                        </section>
                    ) : (
                        /* Şifre formu için ayrı bir key ve new-password standartları */
                        <section key="security-tab" className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Lock size={24} />
                                <h2>Şifre Değiştir</h2>
                            </div>
                            <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className={styles.form}>

                                {/* 1. Mevcut Şifre: current-password ipucu tarayıcıya 'bu eski bilgi' der */}
                                <div className={styles.inputGroup}>
                                    <label htmlFor="currentPassword">Mevcut Şifre</label>
                                    <input
                                        id="currentPassword"
                                        type="password"
                                        autoComplete="current-password"
                                        {...registerPassword('currentPassword', { required: 'Mevcut şifreniz gereklidir' })}
                                        placeholder="••••••••"
                                    />
                                    {passwordErrors.currentPassword && <span className={styles.errorText}>{passwordErrors.currentPassword.message}</span>}
                                </div>

                                {/* 2. Yeni Şifre: new-password ipucu tarayıcıya 'buraya kayıtlı maili basma' der */}
                                <div className={styles.inputGroup}>
                                    <label htmlFor="newPassword">Yeni Şifre</label>
                                    <input
                                        id="newPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        {...registerPassword('newPassword', {
                                            required: 'Yeni şifre gereklidir',
                                            minLength: { value: 6, message: 'Şifre en az 6 karakter olmalıdır' }
                                        })}
                                        placeholder="••••••••"
                                    />
                                    {passwordErrors.newPassword && <span className={styles.errorText}>{passwordErrors.newPassword.message}</span>}
                                </div>

                                {/* 3. Onay Şifresi: Validasyon eklenmiş hali */}
                                <div className={styles.inputGroup}>
                                    <label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        {...registerPassword('confirmPassword', {
                                            required: 'Şifrenizi tekrar giriniz',
                                            validate: (val: string) => {
                                                if (watch('newPassword') !== val) {
                                                    return "Şifreler eşleşmiyor";
                                                }
                                            },
                                        })}
                                        placeholder="••••••••"
                                    />
                                    {passwordErrors.confirmPassword && <span className={styles.errorText}>{passwordErrors.confirmPassword.message}</span>}
                                </div>

                                <button type="submit" className={styles.saveButton} disabled={isLoading}>
                                    <Lock size={20} />
                                    <span>{isLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}</span>
                                </button>
                            </form>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SettingsPage;