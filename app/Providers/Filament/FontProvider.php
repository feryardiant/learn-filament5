<?php

namespace App\Providers\Filament;

use Filament\FontProviders\Contracts\FontProvider as FilamentFontProvider;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\HtmlString;

/**
 * Serves the application font to Filament panels by linking the Vite-built
 * stylesheet defined in `resources/css/fonts.css`, so the panel and the rest of
 * the application share a single font definition.
 *
 * Filament passes its `$url` argument straight through; when omitted, the
 * application's font stylesheet is used.
 */
class FontProvider implements FilamentFontProvider
{
    public function getHtml(string $family, ?string $url = null): Htmlable
    {
        $href = $url ?? Vite::asset('resources/css/fonts.css');

        return new HtmlString('<link href="'.e($href).'" rel="stylesheet" />');
    }
}
