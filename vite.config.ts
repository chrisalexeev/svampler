import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    wasm(),
    topLevelAwait(),
  ],
  build: {
    lib: {
      entry: 'src/lib/sampler/customAudioProcessor.ts', // Path to your main TypeScript file
      name: 'customProcessor', // Name for the output file
      fileName: (format) => `customProcessor.${format}.js` // Output as JavaScript
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      external: ['wasm-int'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          'wasm-int': 'wasmInt'
        }
      }
    }
  }
})
