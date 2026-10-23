<?php

declare(strict_types=1);

namespace SerbisYO\Modules\DevCommentor;

use RuntimeException;

final class CommentStore
{
    private string $file;

    public function __construct()
    {
        $root = dirname(__DIR__, 5);
        $this->file = $root . DIRECTORY_SEPARATOR . 'dev-data' . DIRECTORY_SEPARATOR . 'ui-commentor-comments.json';
    }

    public function all(): array
    {
        if (!is_file($this->file)) {
            return [];
        }

        $contents = file_get_contents($this->file);
        if ($contents === false || trim($contents) === '') {
            return [];
        }

        $decoded = json_decode($contents, true);
        return is_array($decoded) ? array_values($decoded) : [];
    }

    public function create(array $input): array
    {
        $comments = $this->all();
        $now = gmdate('c');
        $comment = $this->normalize($input, [
            'id' => $this->newId(),
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $comments[] = $comment;
        $this->write($comments);

        return $comment;
    }

    public function update(string $id, array $input): ?array
    {
        $comments = $this->all();
        $updated = null;

        foreach ($comments as $index => $comment) {
            if ((string) ($comment['id'] ?? '') !== $id) {
                continue;
            }

            $updated = $this->normalize($input, [
                ...$comment,
                'id' => $id,
                'created_at' => $comment['created_at'] ?? gmdate('c'),
                'updated_at' => gmdate('c'),
            ]);
            $comments[$index] = $updated;
            break;
        }

        if ($updated !== null) {
            $this->write($comments);
        }

        return $updated;
    }

    public function delete(string $id): bool
    {
        $comments = $this->all();
        $filtered = array_values(array_filter(
            $comments,
            static fn (array $comment): bool => (string) ($comment['id'] ?? '') !== $id
        ));

        if (count($filtered) === count($comments)) {
            return false;
        }

        $this->write($filtered);
        return true;
    }

    private function normalize(array $input, array $base = []): array
    {
        $comment = $base;
        $fields = [
            'route', 'page_label', 'target_kind', 'target_selector', 'title',
            'comment_text', 'batch_key', 'category', 'priority', 'status',
        ];

        foreach ($fields as $field) {
            if (array_key_exists($field, $input)) {
                $comment[$field] = trim((string) $input[$field]);
            }
        }

        foreach (['target_descriptor', 'target_rect', 'categories'] as $field) {
            if (array_key_exists($field, $input) && is_array($input[$field])) {
                $comment[$field] = $input[$field];
            }
        }

        $comment['route'] = $comment['route'] ?? '/';
        $comment['page_label'] = $comment['page_label'] ?? '';
        $comment['target_kind'] = in_array(($comment['target_kind'] ?? 'single'), ['single', 'group'], true)
            ? $comment['target_kind']
            : 'single';
        $comment['target_selector'] = $comment['target_selector'] ?? '';
        $comment['target_descriptor'] = is_array($comment['target_descriptor'] ?? null) ? $comment['target_descriptor'] : [];
        $comment['target_rect'] = is_array($comment['target_rect'] ?? null) ? $comment['target_rect'] : [];
        $comment['title'] = $comment['title'] ?? '';
        $comment['comment_text'] = $comment['comment_text'] ?? '';
        $comment['batch_key'] = ($comment['batch_key'] ?? '') !== '' ? $comment['batch_key'] : 'Batch 1';
        $comment['categories'] = is_array($comment['categories'] ?? null) && count($comment['categories'])
            ? array_values(array_unique(array_map('strval', $comment['categories'])))
            : [($comment['category'] ?? 'ui_ux') ?: 'ui_ux'];
        $comment['category'] = $comment['categories'][0] ?? 'ui_ux';
        $comment['priority'] = in_array(($comment['priority'] ?? 'medium'), ['low', 'medium', 'high', 'critical'], true)
            ? $comment['priority']
            : 'medium';
        $comment['status'] = in_array(($comment['status'] ?? 'saved'), ['draft', 'saved', 'resolved', 'archived'], true)
            ? $comment['status']
            : 'saved';

        return $comment;
    }

    private function write(array $comments): void
    {
        $directory = dirname($this->file);
        if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
            throw new RuntimeException('Unable to create UI Commentor storage directory.');
        }

        $json = json_encode(array_values($comments), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($json === false || file_put_contents($this->file, $json . PHP_EOL, LOCK_EX) === false) {
            throw new RuntimeException('Unable to write UI Commentor comments.');
        }
    }

    private function newId(): string
    {
        return 'syc_' . gmdate('Ymd_His') . '_' . bin2hex(random_bytes(3));
    }
}
