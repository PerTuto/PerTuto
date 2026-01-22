import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://pertuto.com',
      dynamicRoutes: [
        '/igcse-tutoring',
        '/ib-tutoring',
        '/cbse-tutoring',
        '/a-level-tutoring',
        '/online-tutoring',
        '/resources/grade-calculator',
        '/resources/past-papers',
        '/about/verified-tutors',
        '/subjects/ib-math-hl',
        '/subjects/ib-physics-hl',
        '/subjects/ib-chemistry-hl',
        '/subjects/igcse-math',
        '/subjects/igcse-physics',
        '/subjects/igcse-chemistry',
        '/subjects/a-level-math',
        '/subjects/a-level-physics',
        '/subjects/cbse-math',
        '/subjects/cbse-physics',
        '/services/small-group',
        '/executive'
      ],
    }),
  ],
})

