import { defineConfig, loadEnv } from 'vite'
import UnoCSS from 'unocss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import AntdResolver from 'unplugin-auto-import-antd'
import { imageminUpload } from 'vite-plugin-imagemin-upload'

const env = loadEnv('', process.cwd())

// https://vitejs.dev/config/
export default defineConfig({
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
			s3: {
				// baseURL: 'https://dbx1fvnryss68.cloudfront.net',
				dir: 'test-upload',
				client: {
					region: 'us-west-2',
					credentials: {
						accessKeyId: env.VITE_AWS_KEY,
						secretAccessKey: env.VITE_AWS_PASSWORD,
					},
				},
				head: {
					Bucket: 'web-stitac',
				},
				put: {
					Bucket: 'web-stitac',
					ACL: 'public-read',
				},
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
				manualChunks(id, { getModuleInfo }) {
					// if (id.includes('ant-design')) return `ant-design`
					// if (id.includes('react')) return `react`

					// 	公共组件
					if (id.includes('src/components')) {
						const module = getModuleInfo(id)
						if (module) {
							const importersLen = module.importers.length + module.dynamicImporters.length
							if (importersLen > 1) return `components/${id.split('components/')[1].split('.')}`
						}
					}
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
			'/usapi': {
				target: 'https://en-robosenmall.robosen.cn/',
				changeOrigin: true,
				rewrite: (servePath) => servePath.replace(/^\/usapi/, ''),
			},
		},
	},
})
