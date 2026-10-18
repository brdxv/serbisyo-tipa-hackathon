<?php

declare(strict_types=1);

use SerbisYO\Http\JsonResponse;
use SerbisYO\Modules\Health\HealthController;

return static function (): never {
    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $path = '/' . trim($path, '/');

    if ($method === 'GET' && $path === '/api/health') {
        HealthController::show();
    }

    JsonResponse::send([
        'error' => 'Route not found',
        'method' => $method,
        'path' => $path,
    ], 404);
};
