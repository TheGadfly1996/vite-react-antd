import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import AntdResolver from 'unplugin-auto-import-antd'
import { imageminUpload } from 'vite-plugin-imagemin-upload'

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
				quality: 10,
			},
			s3: {
				// baseURL: 'https://dbx1fvnryss68.cloudfront.net',
				dir: 'test-upload',
				client: {
					region: 'us-west-2',
					credentials: {
						accessKeyId: 'AKIATHATON2SQB6GZCGN',
						secretAccessKey: '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',
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
					accessKeyId: 'LTAI5tHjgPpnYZmsWs7iJdeF',
					accessKeySecret: 'feDSxaDEZ2yShy76zg5RwlUU5ZqKAO',
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
					function extractModuleName(moduleId: string) {
						const regex = /\.pnpm\/(.*?)(?=\/node_modules)/
						const match = moduleId.match(regex)
						if (match) return match[1]
					}
					// 根据包名进行分包
					const whiteList = ['ant-design']
					const moduleName = extractModuleName(id)

					// node_modules
					if (moduleName) {
						const shouldSplit = whiteList.some((item) => item && id.includes(item))
						if (shouldSplit) {
							return `vendor/${moduleName}`
						} else {
							return `vendor/index`
						}
					}
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
			'@': resolve(__dirname, 'src'),
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
