<?php

declare(strict_types=1);

use SerbisYO\Http\JsonResponse;
use SerbisYO\Modules\DevCommentor\DevCommentorController;
use SerbisYO\Modules\DevImageReview\DevImageReviewController;
use SerbisYO\Modules\Health\HealthController;

return static function (): never {
    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $path = '/' . trim($path, '/');

    if ($method === 'GET' && $path === '/api/health') {
        HealthController::show();
    }

    if ($path === '/api/dev/comments') {
        if ($method === 'GET') {
            DevCommentorController::index();
        }
        if ($method === 'POST') {
            DevCommentorController::create();
        }
    }

    if (preg_match('#^/api/dev/comments/([A-Za-z0-9_-]+)$#', $path, $matches) === 1) {
        if ($method === 'PATCH') {
            DevCommentorController::update($matches[1]);
        }
        if ($method === 'DELETE') {
            DevCommentorController::delete($matches[1]);
        }
    }

    if ($path === '/api/dev/image-review') {
        if ($method === 'GET') {
            DevImageReviewController::index();
        }
    }

    if ($path === '/api/dev/image-review/candidate' && $method === 'PATCH') {
        DevImageReviewController::updateCandidate();
    }

    if ($path === '/api/dev/image-review/refresh' && $method === 'POST') {
        DevImageReviewController::refresh();
    }

    if ($path === '/api/dev/image-review/finalize' && $method === 'POST') {
        DevImageReviewController::finalize();
    }

    JsonResponse::send([
        'error' => 'Route not found',
        'method' => $method,
        'path' => $path,
    ], 404);
};
