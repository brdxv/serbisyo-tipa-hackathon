<?php

declare(strict_types=1);

require dirname(__DIR__) . '/src/bootstrap.php';

use SerbisYO\Config\Env;
use SerbisYO\Http\JsonResponse;

$origin = Env::get('WEB_ORIGIN', 'http://localhost:5173');
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    $router = require dirname(__DIR__) . '/src/Routes/api.php';
    $router();
} catch (Throwable $exception) {
    error_log($exception->__toString());
    JsonResponse::send([
        'error' => 'Internal server error',
    ], 500);
}
