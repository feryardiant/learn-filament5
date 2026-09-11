<?php

namespace App\Providers;

use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

/**
 * Bootstraps the assets that are shared by every Filament panel.
 *
 * Registering them here (rather than on a single panel) means a panel added in
 * the future picks them up automatically, and there is one definition to keep
 * in sync with `vite.config.ts`.
 */
class FilamentServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // `Vite::asset()` throws when there is neither a build manifest nor a
        // running dev server, which is the case during `config:cache` and in
        // tests where assets have not been built.
        if (! Vite::isRunningHot() && ! file_exists(public_path('build/manifest.json'))) {
            return;
        }

        FilamentAsset::register([
            Js::make('app', Vite::asset('resources/js/app.ts'))->module(),
        ], 'app');
    }
}
