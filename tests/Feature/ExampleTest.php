<?php

declare(strict_types=1);

use function Pest\Laravel\get;

test('returns a login redirect response', function () {
    $response = get('/');

    $response->assertRedirect('/login');
});
