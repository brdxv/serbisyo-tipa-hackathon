<?php

declare(strict_types=1);

namespace SerbisYO\Modules\DevCommentor;

use SerbisYO\Http\JsonResponse;

final class DevCommentorController
{
    private static function store(): CommentStore
    {
        return new CommentStore();
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
        JsonResponse::send(['comments' => self::store()->all()]);
    }

    public static function create(): never
    {
        $input = self::input();
        if (($input['status'] ?? 'saved') === 'saved' && trim((string) ($input['comment_text'] ?? '')) === '') {
            JsonResponse::send(['error' => 'Comment text is required.'], 422);
        }

        JsonResponse::send(['comment' => self::store()->create($input)], 201);
    }

    public static function update(string $id): never
    {
        $updated = self::store()->update($id, self::input());
        if ($updated === null) {
            JsonResponse::send(['error' => 'Comment not found.'], 404);
        }

        JsonResponse::send(['comment' => $updated]);
    }

    public static function delete(string $id): never
    {
        if (!self::store()->delete($id)) {
            JsonResponse::send(['error' => 'Comment not found.'], 404);
        }

        JsonResponse::send(['ok' => true]);
    }
}
