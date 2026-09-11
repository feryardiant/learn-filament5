import tailwindcss from '@tailwindcss/vite'
import laravel from 'laravel-vite-plugin'
import { defineConfig, lazyPlugins } from 'vite-plus'

export default defineConfig({
  staged: {
    '*.{md,json,js,ts,yaml,yml}': 'vp check --fix',
    '{app,config,database,routers,tests}/**/*.php': 'php vendor/bin/pint --parallel',
  },
  fmt: {
    printWidth: 120,
    singleQuote: true,
    semi: false,
    sortImports: true,
    singleAttributePerLine: false,
    htmlWhitespaceSensitivity: 'css',
    ignorePatterns: ['composer.json', 'resources/views/mail/*', 'tests/coverage/**'],
    sortTailwindcss: {
      entryPoint: 'resources/css/app.css',
    },
  },
  lint: {
    ignorePatterns: ['vendor/**', 'node_modules/**', 'public/**', 'tests/coverage/**'],
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    options: { denyWarnings: true, typeAware: true },
    rules: {
      'vite-plus/prefer-vite-plus-imports': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  plugins: lazyPlugins(() => [
    laravel({
      input: ['resources/css/fonts.css', 'resources/css/app.css', 'resources/js/app.ts'],
      refresh: true,
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
        '**/tests/coverage/**',
        '**/vendor/**',
      ],
    },
  },
})
