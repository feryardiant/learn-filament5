import tailwindcss from '@tailwindcss/vite'
import laravel from 'laravel-vite-plugin'
import { defineConfig, lazyPlugins, loadEnv, PluginOption, UserConfig } from 'vite-plus'

export default defineConfig(({ mode }): UserConfig => {
  // Read the real `.env` (including non-`VITE_` prefixed keys, hence the empty
  // prefix) rather than `process.env`, so `vp --mode <mode>` also picks up the
  // matching `.env.<mode>` file.
  const env = loadEnv(mode, '.', '')

  // In Docker, APP_URL comes from the container environment (see .env), so the
  // dev assets can be served from the same origin the browser is already using.
  const appUrl = new URL(env.APP_URL || 'http://localhost')

  return {
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
      options: { denyWarnings: true, typeAware: true, typeCheck: true },
      rules: {
        'vite-plus/prefer-vite-plus-imports': 'error',
        'no-console': ['error', { allow: ['warn', 'error'] }],
      },
    },
    // `laravel()` and `tailwindcss()` each return an array of plugins, so they
    // are spread into a flat `PluginOption[]` (as `lazyPlugins()` expects). The
    // cast is required: inferring the type instead hits TypeScript's recursion
    // limit on Vite's recursive `PluginOption` type.
    plugins: lazyPlugins(
      () =>
        [
          laravel({
            input: ['resources/css/fonts.css', 'resources/css/app.css', 'resources/js/app.ts'],
            refresh: true,
          }),
          tailwindcss(),
        ] as PluginOption[],
    ),
    server: {
      // This must be the full origin (`https://host`): it is written verbatim
      // into `public/hot`, which `Vite::asset()` turns into asset URLs.
      origin: appUrl.origin,
      // The proxy forwards `Host: $host`, and the plugin only handles CORS (not
      // Vite's host check), so the app's hostname must be allowed explicitly or
      // Vite answers every proxied request with 403.
      allowedHosts: [appUrl.hostname],
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
  }
})
