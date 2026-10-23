<?php

declare(strict_types=1);

namespace SerbisYO\Modules\DevImageReview;

use RuntimeException;
use SerbisYO\Http\JsonResponse;

final class DevImageReviewController
{
    private static function store(): ImageReviewStore
    {
        return new ImageReviewStore();
    }

    private static function input(): array
    {
        $raw = file_get_contents('php://input');
        if ($raw === false || trim($raw) === '') {
            return [];
        }
        $decoded = json_decode($raw, true);
        return is_array($decoded) ? $decoded : [];
    }

    public static function index(): never
    {
        JsonResponse::send(self::store()->catalog());
    }

    public static function updateCandidate(): never
    {
        $input = self::input();
        $placeId = trim((string) ($input['placeId'] ?? ''));
        $candidateId = trim((string) ($input['candidateId'] ?? ''));
        $status = trim((string) ($input['status'] ?? 'pending'));
        $isMain = (bool) ($input['isMain'] ?? false);

        if ($placeId === '' || $candidateId === '') {
            JsonResponse::send(['error' => 'placeId and candidateId are required.'], 422);
        }

        try {
            JsonResponse::send(self::store()->updateCandidate($placeId, $candidateId, $status, $isMain));
        } catch (RuntimeException $error) {
            JsonResponse::send(['error' => $error->getMessage()], 422);
        }
    }

    public static function refresh(): never
    {
        $input = self::input();
        $placeId = trim((string) ($input['placeId'] ?? ''));
        if ($placeId === '') {
            JsonResponse::send(['error' => 'placeId is required.'], 422);
        }

        try {
            JsonResponse::send(self::store()->refreshPlace($placeId));
        } catch (RuntimeException $error) {
            JsonResponse::send(['error' => $error->getMessage()], 422);
        }
    }

    public static function finalize(): never
    {
        try {
            JsonResponse::send(self::store()->finalize());
        } catch (RuntimeException $error) {
            JsonResponse::send(['error' => $error->getMessage()], 422);
        }
    }
}

