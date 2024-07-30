import { defineConfig, loadEnv } from 'vite'
import UnoCSS from 'unocss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import AntdResolver from 'unplugin-auto-import-antd'
import { imageminUpload } from 'vite-plugin-imagemin-upload'

const env = loadEnv('', process.cwd())

// https://vitejs.dev/config/
export default defineConfig({
	/**
	 * ! 全局sass变量
	 */
	css: {
		preprocessorOptions: {
			scss: {
				// additionalData: `@use "@/styles/variables.scss" as *;`,
			},
		},
	},
	plugins: [
		UnoCSS(),
		react(),
		AutoImport({
			dts: 'src/types/auto-imports.d.ts',
			imports: ['react'],
			resolvers: [AntdResolver()],
		}),
		imageminUpload({
			lossless: {},
			lossy: {
				quality: 80,
			},
			oss: {
				baseURL: 'https://plugin-js.oss-accelerate.aliyuncs.com',
				dir: 'test-upload',
				client: {
					region: 'oss-cn-hangzhou',
					bucket: 'plugin-js',
					accessKeyId: env.VITE_OSS_KEY,
					accessKeySecret: env.VITE_OSS_PASSWORD,
				},
			},
		}),
	],
	build: {
		rollupOptions: {
			/**
			 * ! 打包输出文件目录和代码拆分
			 */
			output: {
				chunkFileNames: 'static/js/[name]-[hash].js',
				entryFileNames: 'static/js/[name]-[hash].js',
				assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
				manualChunks: {
					react: ['react', 'react-dom', 'react-router-dom'],
					antd: ['antd'],
				},
			},
		},
	},

	/**
	 * ! 项目别名
	 */
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	/**
	 * ! 开发服务器
	 */
	server: {
		host: '0.0.0.0',
		open: true,
		proxy: {
			'/api': {
				target: 'http://localhost:7777',
				changeOrigin: true,
				rewrite: (servePath) => servePath.replace(/^\/api/, ''),
			},
		},
	},
})
