import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import AntdResolver from 'unplugin-auto-import-antd'

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
	],
	/**
	 * ! 项目别名
	 */
	resolve: {
		alias: {
			'@': path.join(__dirname, 'src'),
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
