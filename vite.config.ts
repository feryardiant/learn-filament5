import tailwindcss from '@tailwindcss/vite'
import laravel from 'laravel-vite-plugin'
import { bunny } from 'laravel-vite-plugin/fonts'
import { defineConfig, lazyPlugins } from 'vite-plus'

export default defineConfig({
  fmt: {
    printWidth: 120,
    singleQuote: true,
    semi: false,
    sortImports: true,
    singleAttributePerLine: false,
    htmlWhitespaceSensitivity: 'css',
    ignorePatterns: ['composer.json', 'resources/views/mail/*'],
    sortTailwindcss: {
      entryPoint: 'resources/css/app.css',
    },
  },
  lint: {
    ignorePatterns: ['vendor/**', 'node_modules/**', 'public/**'],
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    options: { denyWarnings: true, typeAware: true },
    rules: {
      'vite-plus/prefer-vite-plus-imports': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  plugins: lazyPlugins(() => [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.ts'],
      refresh: true,
      fonts: [
        bunny('Instrument Sans', {
          weights: [400, 500, 600],
        }),
      ],
    }),
    tailwindcss(),
  ]),
  server: {
    cors: true,
    watch: {
      ignored: [
        '**/.agents/**',
        '**/.claude/**',
        '**/.cursor/**',
        '**/.junie/**',
        '**/storage/framework/views/**',
        '**/vendor/**',
      ],
    },
  },
})
