import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    // .env 파일을 확실하게 불러옵니다.
    const env = loadEnv(mode, process.cwd(), '');

    return {
        // PWA 플러그인을 먼저 설정합니다.
        plugins: [
            VitePWA({
                registerType: 'autoUpdate',
                manifest: {
                    name: 'AI 패션 피팅룸',
                    short_name: 'AI 피팅룸',
                    description: 'AI를 통해 가상으로 옷을 입어보세요!',
                    theme_color: '#111827',
                    background_color: '#111827',
                    icons: [
                      { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
                      { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
                    ]
                }
            })
        ],
        // 그 다음, API 키를 앱이 사용할 수 있도록 정의합니다.
        // 이것이 원래 작동하던 방식이며, 가장 확실한 방법입니다.
        define: {
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            }
        }
    };
});