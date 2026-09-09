<?php

use function Pest\Laravel\get;

test('returns a login redirect response', function () {
    $response = get('/');

    $response->assertRedirect('/login');
});
