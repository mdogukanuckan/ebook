import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { login as loginApi } from '../../../features/auth/services/authApi';
import { Loader2, LogIn, AlertCircle } from 'lucide-react';
import type { AuthResponse } from '../../../features/auth/types/auth';
import styles from '../AuthForms.module.css';

const loginSchema = z.object({
    username: z.string().min(3, 'Kullanıcı adı en az 3 karakter olmalıdır'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSuccess: (response: AuthResponse) => void;
    onError?: (error: string) => void;
}

export const LoginForm = ({ onSuccess, onError }: LoginFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await loginApi(data);
            onSuccess(response);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
            setError(errorMessage);
            onError?.(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {error && (
                <div className={`${styles.alert} ${styles.error}`}>
                    <AlertCircle className={`${styles.alertIcon} ${styles.error}`} />
                    <p className={`${styles.alertText} ${styles.error}`}>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="username" className={styles.inputLabel}>
                        Kullanıcı Adı
                    </label>
                    <input
                        id="username"
                        type="text"
                        {...register('username')}
                        className={`${styles.inputField} ${errors.username ? styles.error : ''
                            }`}
                        placeholder="kullaniciadi"
                        disabled={isSubmitting}
                    />
                    {errors.username && (
                        <p className={styles.inputError}>{errors.username.message}</p>
                    )}
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.inputLabel}>
                        Şifre
                    </label>
                    <input
                        id="password"
                        type="password"
                        {...register('password')}
                        className={`${styles.inputField} ${errors.password ? styles.error : ''
                            }`}
                        placeholder="••••••••"
                        disabled={isSubmitting}
                    />
                    {errors.password && (
                        <p className={styles.inputError}>{errors.password.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.submitButton}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className={`${styles.buttonIcon} ${styles.spin}`} />
                            <span>Giriş yapılıyor...</span>
                        </>
                    ) : (
                        <>
                            <LogIn className={styles.buttonIcon} />
                            <span>Giriş Yap</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
