import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/dungdung/',
  plugins: [react()],
  test: {
    include: ['tests/**/*.test.ts'],
  },
})
