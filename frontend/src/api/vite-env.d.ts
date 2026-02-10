/**
 * Environment variables exposed via Vite.
 */
interface ImportMetaEnv {
  /** Base URL for API requests */
  readonly VITE_API_BASE_URL: string;
}

/**
 * Provides access to the import meta environment.
 */
interface ImportMeta {
  /** Vite environment variables */
  readonly env: ImportMetaEnv;
}
