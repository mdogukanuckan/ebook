
interface EnvironmentConfig {
    
    apiBaseUrl: string;

    appName: string;
    appVersion: string;
    environment: 'development' | 'staging' | 'production';

    enableAnalytics: boolean;
    enableDebug: boolean;

    googleAnalyticsId?: string;
    sentryDsn?: string;
}

function validateEnv(): void {
    const required = ['VITE_API_BASE_URL', 'VITE_APP_NAME'];
    const missing = required.filter(key => !import.meta.env[key]);

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}\n` +
            'Please check your .env file and ensure all required variables are set.'
        );
    }
}

validateEnv();

export const config: EnvironmentConfig = {
    
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,

    appName: import.meta.env.VITE_APP_NAME || 'E-Book Reader',
    appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: (import.meta.env.VITE_ENVIRONMENT || 'development') as EnvironmentConfig['environment'],

    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',

    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
};

export const isDevelopment = config.environment === 'development';

export const isProduction = config.environment === 'production';

export const isStaging = config.environment === 'staging';

if (isDevelopment && config.enableDebug) {
    console.log('🔧 Environment Configuration:', {
        environment: config.environment,
        apiBaseUrl: config.apiBaseUrl,
        appVersion: config.appVersion,
    });
}
