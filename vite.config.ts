import tailwindcss from '@tailwindcss/vite'
import laravel from 'laravel-vite-plugin'
import { defineConfig, lazyPlugins } from 'vite-plus'

// In Docker, APP_URL comes from the container environment (see .env), so the
// dev assets can be served from the same origin the browser is already using.
const appUrl = process.env.APP_URL

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
    // Serve dev assets from the application's own origin through the nginx
    // proxy in docker/development/nginx/40-vite.conf. Loading them straight
    // from the plain-HTTP Vite dev server would be blocked as mixed content
    // when the app is served over HTTPS (e.g. via the OrbStack proxy).
    origin: appUrl,
    ...(appUrl ? { allowedHosts: [new URL(appUrl).hostname] } : {}),
    // Proxy the HMR websocket on its own path so it does not collide with the
    // application's routes (see 40-vite.conf).
    hmr: { path: '/vite-hmr' },
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
