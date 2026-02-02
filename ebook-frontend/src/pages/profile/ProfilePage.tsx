import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Shield } from 'lucide-react';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
    const { user } = useAuth();

    if (!user) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                    <User size={48} />
                </div>
                <div className={styles.headerInfo}>
                    <h1 className={styles.username}>{user.username}</h1>
                    <p className={styles.email}>{user.email}</p>
                </div>
            </div>

            <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                    <div className={styles.cardIcon}>
                        <User size={20} />
                    </div>
                    <div className={styles.cardContent}>
                        <p className={styles.cardLabel}>Kullanıcı Adı</p>
                        <p className={styles.cardValue}>{user.username}</p>
                    </div>
                </div>

                <div className={styles.infoCard}>
                    <div className={styles.cardIcon}>
                        <Mail size={20} />
                    </div>
                    <div className={styles.cardContent}>
                        <p className={styles.cardLabel}>E-posta</p>
                        <p className={styles.cardValue}>{user.email}</p>
                    </div>
                </div>

                {(user.firstName || user.lastName) && (
                    <div className={styles.infoCard}>
                        <div className={styles.cardIcon}>
                            <User size={20} />
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardLabel}>Ad Soyad</p>
                            <p className={styles.cardValue}>
                                {user.firstName} {user.lastName}
                            </p>
                        </div>
                    </div>
                )}

                <div className={styles.infoCard}>
                    <div className={styles.cardIcon}>
                        <Shield size={20} />
                    </div>
                    <div className={styles.cardContent}>
                        <p className={styles.cardLabel}>Roller</p>
                        <div className={styles.roles}>
                            {user.roles.map((role, index) => (
                                <span key={index} className={styles.roleBadge}>
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.editButton}>
                    Profili Düzenle
                </button>
                <button className={styles.settingsButton}>
                    Ayarlar
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;