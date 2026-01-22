/**
 * Environment Configuration
 * 
 * Centralized configuration for environment variables.
 * All environment variables must be prefixed with VITE_ to be exposed to the client.
 */

interface EnvironmentConfig {
    // API Configuration
    apiBaseUrl: string;

    // Application Configuration
    appName: string;
    appVersion: string;
    environment: 'development' | 'staging' | 'production';

    // Feature Flags
    enableAnalytics: boolean;
    enableDebug: boolean;

    // Optional Services
    googleAnalyticsId?: string;
    sentryDsn?: string;
}

/**
 * Validates that required environment variables are present
 */
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

// Validate environment on load
validateEnv();

/**
 * Application configuration object
 * Access environment variables through this object instead of import.meta.env directly
 */
export const config: EnvironmentConfig = {
    // API Configuration
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,

    // Application Configuration
    appName: import.meta.env.VITE_APP_NAME || 'E-Book Reader',
    appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: (import.meta.env.VITE_ENVIRONMENT || 'development') as EnvironmentConfig['environment'],

    // Feature Flags
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',

    // Optional Services
    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
};

/**
 * Helper to check if we're in development mode
 */
export const isDevelopment = config.environment === 'development';

/**
 * Helper to check if we're in production mode
 */
export const isProduction = config.environment === 'production';

/**
 * Helper to check if we're in staging mode
 */
export const isStaging = config.environment === 'staging';

// Log configuration in development (helps with debugging)
if (isDevelopment && config.enableDebug) {
    console.log('🔧 Environment Configuration:', {
        environment: config.environment,
        apiBaseUrl: config.apiBaseUrl,
        appVersion: config.appVersion,
    });
}
