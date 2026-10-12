---
paths:
    - 'resources/css/**'
---

# Css

## Font is single-sourced from @fontsource-variable/inter

Inter Variable is self-hosted from the devDependency `@fontsource-variable/inter` and declared once in `resources/css/fonts.css` (the `@import` plus the `--font-inter` stack), which is a Vite entry. The Filament panel consumes it through `App\Providers\Filament\FontProvider` (which links `Vite::asset('resources/css/fonts.css')`); other Blade views load it with `@vite('resources/css/fonts.css')`. Do not reintroduce `Instrument Sans`, a CDN font, or a bare `->font('Inter Variable')` (that silently switches Filament to the Bunny CDN).

Do not use the `laravel-vite-plugin/fonts` `fontsource()` provider with a variable package: its subset matcher builds `-latin-{weight}-normal` from the numeric weight while variable filenames are `inter-latin-wght-normal.woff2`, so the build always fails. Static `@fontsource/inter` (numeric weight CSS files) is the package to use if the provider's preload/fallback features are ever wanted.
