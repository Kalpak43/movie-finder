/// <reference types="vite/client" />

interface importMetaEnv {
  readonly VITE_OMDB_KEY: string;
  readonly VITE_OMDB_URL: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
