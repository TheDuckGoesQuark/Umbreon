import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';

const serverUrl = process.env.UMBREON_SERVER_URL ?? 'http://localhost:8080';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), viteTsconfigPaths(), svgrPlugin(), checker({typescript: true})],
    server: {
        open: true,
        port: 3000,
        proxy: {
            '/api': serverUrl,
            '/bot': serverUrl,
            '/ws': {target: serverUrl, ws: true},
        },
    },
    build: {
        outDir: "./build"
    },
});
