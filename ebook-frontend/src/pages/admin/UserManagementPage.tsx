import React, { useEffect, useState } from 'react';
import type { User } from '../../features/user/types';
import userService from '../../features/user/services/userService';
import styles from './UserManagementPage.module.css';
import { Shield, ShieldAlert, UserX, UserCheck, Loader2 } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { addToast } from '../../store/slices/uiSlice';

const UserManagementPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users', error);
            dispatch(addToast({ message: 'Kullanıcı listesi yüklenemedi.', type: 'error' }));
        } finally {
            setLoading(false);
        }
    };

    const handleRoleToggle = async (user: User) => {
        const isAdmin = user.roles?.some((r: any) => typeof r === 'string' ? r === 'ROLE_ADMIN' : r.name === 'ROLE_ADMIN');

        const currentRoles = user.roles?.map((r: any) => typeof r === 'string' ? r : r.name) || [];

        let newRoles: string[];
        if (isAdmin) {
            
            newRoles = currentRoles.filter((r: string) => r !== 'ROLE_ADMIN');
            
            if (!newRoles.includes('ROLE_USER')) newRoles.push('ROLE_USER');
        } else {
            
            newRoles = [...currentRoles, 'ROLE_ADMIN'];
        }

        try {
            await userService.updateUserByAdmin(user.id, { roles: newRoles });
            dispatch(addToast({ message: `Kullanıcı rolü güncellendi: ${isAdmin ? 'Yönetici yetkisi alındı' : 'Yönetici yapıldı'}`, type: 'success' }));
            loadUsers();
        } catch (error) {
            dispatch(addToast({ message: 'Rol güncellenemedi.', type: 'error' }));
        }
    };

    const handleStatusToggle = async (user: User) => {
        try {
            const newStatus = !user.enabled;
            await userService.updateUserByAdmin(user.id, { enabled: newStatus });
            dispatch(addToast({ message: `Kullanıcı durumu: ${newStatus ? 'Aktif' : 'Pasif'}`, type: 'success' }));
            loadUsers();
        } catch (error) {
            dispatch(addToast({ message: 'Durum güncellenemedi.', type: 'error' }));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Kullanıcı Yönetimi</h1>
                <p className={styles.description}>
                    Sistemdeki kayıtlı kullanıcıları görüntüleyin ve yönetin.
                </p>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Kullanıcı</th>
                            <th>E-Posta</th>
                            <th>Roller</th>
                            <th>Durum</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => {
                            const isAdmin = user.roles?.some((r: any) => (typeof r === 'string' ? r : r.name) === 'ROLE_ADMIN');
                            const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || user.username?.[0] || '?');

                            return (
                                <tr key={user.id}>
                                    <td>
                                        <div className={styles.userInfo}>
                                            <div className={styles.avatar}>{initials.toUpperCase()}</div>
                                            <div>
                                                <div className="font-medium text-slate-900">
                                                    {user.firstName} {user.lastName}
                                                </div>
                                                <div className="text-sm text-slate-500">@{user.username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        {user.roles?.map((role: any, idx) => {
                                            const roleName = typeof role === 'string' ? role : role.name;
                                            const isRoleAdmin = roleName === 'ROLE_ADMIN';
                                            return (
                                                <span key={idx} className={`${styles.roleBadge} ${isRoleAdmin ? styles.adminRole : styles.userRole}`}>
                                                    {roleName.replace('ROLE_', '')}
                                                </span>
                                            );
                                        })}
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${user.enabled ? styles.active : styles.passive}`}>
                                            {user.enabled ? 'Aktif' : 'Pasif'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className={`${styles.actionButton} ${styles.editButton}`}
                                                onClick={() => handleRoleToggle(user)}
                                                title={isAdmin ? "Yönetici yetkisini al" : "Yönetici yap"}
                                            >
                                                {isAdmin ? <ShieldAlert size={18} /> : <Shield size={18} />}
                                            </button>

                                            <button
                                                className={`${styles.actionButton} ${styles.dangerButton}`}
                                                onClick={() => handleStatusToggle(user)}
                                                title={user.enabled ? "Hesabı dondur" : "Hesabı aktifleştir"}
                                            >
                                                {user.enabled ? <UserX size={18} /> : <UserCheck size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagementPage;
