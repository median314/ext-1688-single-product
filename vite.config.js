import { defineConfig } from 'vite'
// import { transformSync, parseSync, types as t, template } from '@babel/core'

import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    // {
    //   name: 'function-prefixer',
    //   transform(code, id) {
    //     const ast = parseSync(code, { filename: id, presets: ['@babel/preset-react'] })
    //     t.traverse(ast, {
    //       FunctionDeclaration(path) {
    //         path.node.id.name = 'prefix_' + path.node.id.name
    //       },
    //     })
    //     const output = transformSync(code, {
    //       filename: id,
    //       ast:true,
    //       code: true,
    //       configFile: false,
    //       presets: ['@babel/preset-react'],
    //     })
    //     return output.code
    //   },
    // },
  ],

  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        background: 'extension/background.js',
        contentScript: 'extension/contentScript.js',
        tabnoise: 'extension/tabnoise.js',
        // popup: 'src/popup/index.html',
        // options: 'src/options/index.html',
      },
      output: {
        banner: '(function(){',
        footer: '})();',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
    // Output directory must match Chrome Extension's structure
    outDir: 'dist',
  },

  base: './'
})

