<?php

declare(strict_types=1);

namespace SerbisYO\Modules\Health;

use SerbisYO\Http\JsonResponse;

final class HealthController
{
    public static function show(): never
    {
        JsonResponse::send([
            'ok' => true,
            'service' => 'serbisyo-api',
            'runtime' => 'php',
        ]);
    }
}
