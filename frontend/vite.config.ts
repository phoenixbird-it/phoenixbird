import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const srcDir = path.resolve(import.meta.dirname, 'src')
const scssDir = path.join(srcDir, 'assets', 'scss')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Resolve `@use 'assets/scss/...'` from src/ …
        loadPaths: [srcDir],
        // … and auto-inject design tokens + mixins into every component
        // stylesheet, so CSS modules never need a boilerplate @use line.
        // The global sheets under src/assets/scss are skipped to avoid a
        // circular dependency.
        additionalData: (source: string, filename: string) =>
          path.resolve(filename).startsWith(scssDir)
            ? source
            : `@use 'assets/scss/abstracts' as *;\n${source}`,
      },
    },
  },
})
