import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { register as registerApi } from '../../../features/auth/services/authApi';
import { Loader2, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { AuthResponse } from '../../../features/auth/types/auth';
import styles from '../AuthForms.module.css';

// Validation schema
const registerSchema = z
    .object({
        username: z
            .string()
            .min(3, 'Kullanıcı adı en az 3 karakter olmalıdır')
            .max(20, 'Kullanıcı adı en fazla 20 karakter olabilir')
            .regex(/^[a-zA-Z0-9_]+$/, 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir'),
        email: z.string().email('Geçerli bir e-posta adresi giriniz'),
        firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
        lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
        password: z
            .string()
            .min(6, 'Şifre en az 6 karakter olmalıdır')
            .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
            .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
            .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Şifreler eşleşmiyor',
        path: ['confirmPassword'],
    });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
    onSuccess: (response: AuthResponse) => void;
    onError?: (error: string) => void;
}

export const RegisterForm = ({ onSuccess, onError }: RegisterFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...registerData } = data;
            const response = await registerApi(registerData);

            setSuccess(true);
            onSuccess(response);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.';
            setError(errorMessage);
            onError?.(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Success Alert */}
            {success && (
                <div className={`${styles.alert} ${styles.success}`}>
                    <CheckCircle2 className={`${styles.alertIcon} ${styles.success}`} />
                    <div>
                        <p className={`${styles.alertText} ${styles.success} ${styles.alertTitle}`}>
                            Kayıt başarılı!
                        </p>
                        <p className={`${styles.alertText} ${styles.success}`}>
                            Ana sayfaya yönlendiriliyorsunuz...
                        </p>
                    </div>
                </div>
            )}

            {/* Error Alert */}
            {error && (
                <div className={`${styles.alert} ${styles.error}`}>
                    <AlertCircle className={`${styles.alertIcon} ${styles.error}`} />
                    <p className={`${styles.alertText} ${styles.error}`}>{error}</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                {/* Username and Email Row */}
                <div className={styles.formRow}>
                    {/* Username Field */}
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
                            disabled={isSubmitting || success}
                        />
                        {errors.username && (
                            <p className={styles.inputError}>{errors.username.message}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.inputLabel}>
                            E-posta
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            className={`${styles.inputField} ${errors.email ? styles.error : ''
                                }`}
                            placeholder="ornek@email.com"
                            disabled={isSubmitting || success}
                        />
                        {errors.email && <p className={styles.inputError}>{errors.email.message}</p>}
                    </div>
                </div>

                {/* First Name and Last Name Row */}
                <div className={styles.formRow}>
                    {/* First Name Field */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="firstName" className={styles.inputLabel}>
                            Ad
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            {...register('firstName')}
                            className={`${styles.inputField} ${errors.firstName ? styles.error : ''
                                }`}
                            placeholder="Adınız"
                            disabled={isSubmitting || success}
                        />
                        {errors.firstName && (
                            <p className={styles.inputError}>{errors.firstName.message}</p>
                        )}
                    </div>

                    {/* Last Name Field */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="lastName" className={styles.inputLabel}>
                            Soyad
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            {...register('lastName')}
                            className={`${styles.inputField} ${errors.lastName ? styles.error : ''
                                }`}
                            placeholder="Soyadınız"
                            disabled={isSubmitting || success}
                        />
                        {errors.lastName && (
                            <p className={styles.inputError}>{errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                {/* Password and Confirm Password Row */}
                <div className={styles.formRow}>
                    {/* Password Field */}
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
                            disabled={isSubmitting || success}
                        />
                        {errors.password && (
                            <p className={styles.inputError}>{errors.password.message}</p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword" className={styles.inputLabel}>
                            Şifre Tekrar
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            {...register('confirmPassword')}
                            className={`${styles.inputField} ${errors.confirmPassword ? styles.error : ''
                                }`}
                            placeholder="••••••••"
                            disabled={isSubmitting || success}
                        />
                        {errors.confirmPassword && (
                            <p className={styles.inputError}>{errors.confirmPassword.message}</p>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || success}
                    className={styles.submitButton}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className={`${styles.buttonIcon} ${styles.spin}`} />
                            <span>Kayıt yapılıyor...</span>
                        </>
                    ) : success ? (
                        <>
                            <CheckCircle2 className={styles.buttonIcon} />
                            <span>Kayıt başarılı!</span>
                        </>
                    ) : (
                        <>
                            <UserPlus className={styles.buttonIcon} />
                            <span>Kayıt Ol</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
