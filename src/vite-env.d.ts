/// <reference types="vite/client" />

interface importMetaEnv {
  readonly VITE_OMDB_KEY: string;
  readonly VITE_OMDB_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
