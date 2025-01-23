import { defineConfig } from 'vite'
import topLevelAwait from 'vite-plugin-top-level-await'
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [topLevelAwait(), glsl()],
  base: './',
})