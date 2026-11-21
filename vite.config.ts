import { defineConfig, loadEnv } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { blogPlugin } from './scripts/vite-plugin-blog.ts'
import { mediaPlugin } from './scripts/vite-plugin-media.ts'
import { createContactHandler } from './server/contact/handler.ts'
import { handleNodeRequest } from './server/nodeAdapter.ts'

const CONTACT_ROUTE = '/api/contact'

function contactDevPlugin(env: Record<string, string>): Plugin {
  const handle = createContactHandler({ allowLocalhost: true })

  return {
    name: 'contact-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(CONTACT_ROUTE, (request, response) => {
        void handleNodeRequest(request, response, handle, env, false)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      blogPlugin(),
      mediaPlugin(),
      contactDevPlugin(env),
    ],
  }
})
