import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// En dev, le front appelle /api et /auth en relatif : Vite les redirige vers Spring Boot.
// En prod, c'est Nginx qui fait ce routage, cette config n'est utilisée que par `npm run dev`.
// Pour changer l'adresse du backend : créer un fichier .env.local avec BACKEND_URL=http://localhost:XXXX
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backend = env.BACKEND_URL || 'http://localhost:8080'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': { target: backend, changeOrigin: true },
        '/auth': { target: backend, changeOrigin: true },
      },
    },
  }
})
