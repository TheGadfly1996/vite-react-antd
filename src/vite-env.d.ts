/// <reference types="vite/client" />

interface ImportMetaEnv {}

interface ImportMeta {
	readonly env: ImportMetaEnv
	readonly OSS_KEY: string
	readonly OSS_PASSWORD: string
	readonly AWS_KEY: string
	readonly AWS_PASSWORD: string
	readonly VITE_APP_API_URL: string
	readonly VITE_APP_ENV: string
}
