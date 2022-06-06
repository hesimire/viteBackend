import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import path from 'path'

// 按需引入ant-design-vue@3.2.5
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 浏览器适配配置
    legacy({
      targets: ['&gt; 1%, last 1 version, ie &gt;= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'], // 面向IE11时需要此插件
    }),
    // 按需引入ant-design-vue@3.2.5配置
    Components({
      resolvers: [AntDesignVueResolver()]
    }),
    // 优雅的在script setup中加入name 方便keepalive
    VueSetupExtend()
  ],
  server: {
    proxy: {
      // with options
      '/api': {
        target: 'http://192.168.1.4:3001',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src'), // 路径别名
    },
    extensions: ['.js', '.json', '.js'] // 使用路径别名时想要省略的后缀名，可以自己增减
  }

})
