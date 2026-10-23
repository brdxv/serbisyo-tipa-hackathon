<?php

declare(strict_types=1);

namespace SerbisYO\Modules\DevImageReview;

use RuntimeException;

final class ImageReviewStore
{
    private string $root;
    private string $placesFile;
    private string $candidatesFile;
    private string $extrasFile;
    private string $decisionsFile;
    private string $outputRoot;

    public function __construct()
    {
        $this->root = dirname(__DIR__, 5);
        $this->placesFile = $this->root . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'morong-real-places.json';
        $this->candidatesFile = $this->root . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'wikimedia-image-candidates.json';
        $this->extrasFile = $this->root . DIRECTORY_SEPARATOR . 'dev-data' . DIRECTORY_SEPARATOR . 'image-review-extra-candidates.json';
        $this->decisionsFile = $this->root . DIRECTORY_SEPARATOR . 'dev-data' . DIRECTORY_SEPARATOR . 'image-review-decisions.json';
        $this->outputRoot = $this->root . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'establishments';
    }

    public function catalog(): array
    {
        $placesData = $this->readJson($this->placesFile, ['places' => []]);
        $candidateData = $this->readJson($this->candidatesFile, ['places' => []]);
        $extraData = $this->readJson($this->extrasFile, ['places' => []]);
        $decisions = $this->readJson($this->decisionsFile, ['places' => []]);

        $candidatesByPlace = [];
        foreach (array_merge($candidateData['places'] ?? [], $extraData['places'] ?? []) as $entry) {
            $placeId = (string) ($entry['id'] ?? '');
            if ($placeId === '') {
                continue;
            }

            $existing = $candidatesByPlace[$placeId] ?? [];
            foreach (($entry['candidates'] ?? []) as $candidate) {
                if (!is_array($candidate) || empty($candidate['originalUrl'])) {
                    continue;
                }
                $mime = strtolower((string) ($candidate['mime'] ?? ''));
                if ($mime !== '' && !str_starts_with($mime, 'image/')) {
                    continue;
                }
                $candidateId = $this->candidateId((string) $candidate['originalUrl']);
                $existing[$candidateId] = [
                    ...$candidate,
                    'id' => $candidateId,
                    'source' => (string) ($candidate['source'] ?? 'Wikimedia Commons'),
                ];
            }
            $candidatesByPlace[$placeId] = $existing;
        }

        $places = [];
        $totalCandidates = 0;
        $reviewedCandidates = 0;

        foreach (($placesData['places'] ?? []) as $place) {
            if (!is_array($place)) {
                continue;
            }

            $placeId = (string) ($place['id'] ?? '');
            $placeDecisions = is_array($decisions['places'][$placeId] ?? null) ? $decisions['places'][$placeId] : [];
            $candidates = [];

            foreach (array_values($candidatesByPlace[$placeId] ?? []) as $candidate) {
                $candidateId = (string) $candidate['id'];
                $decision = is_array($placeDecisions[$candidateId] ?? null) ? $placeDecisions[$candidateId] : [];
                $statusValue = (string) ($decision['status'] ?? 'pending');
                $status = in_array($statusValue, ['pending', 'approved', 'rejected'], true)
                    ? $statusValue
                    : 'pending';
                $isMain = $status === 'approved' && (bool) ($decision['isMain'] ?? false);

                $candidates[] = [
                    ...$candidate,
                    'status' => $status,
                    'isMain' => $isMain,
                ];

                $totalCandidates++;
                if ($status !== 'pending') {
                    $reviewedCandidates++;
                }
            }

            $approvedCount = count(array_filter($candidates, static fn (array $candidate): bool => $candidate['status'] === 'approved'));
            $rejectedCount = count(array_filter($candidates, static fn (array $candidate): bool => $candidate['status'] === 'rejected'));
            $pendingCount = count($candidates) - $approvedCount - $rejectedCount;
            $hasMain = count(array_filter($candidates, static fn (array $candidate): bool => (bool) $candidate['isMain'])) > 0;

            $places[] = [
                ...$place,
                'candidates' => $candidates,
                'review' => [
                    'candidateCount' => count($candidates),
                    'approvedCount' => $approvedCount,
                    'rejectedCount' => $rejectedCount,
                    'pendingCount' => $pendingCount,
                    'hasMain' => $hasMain,
                    'targetCount' => 3,
                    'needsMore' => $approvedCount < 3 || !$hasMain,
                ],
            ];
        }

        return [
            'generatedAt' => gmdate('c'),
            'outputPath' => $this->outputRoot,
            'progress' => [
                'totalCandidates' => $totalCandidates,
                'reviewedCandidates' => $reviewedCandidates,
                'pendingCandidates' => max(0, $totalCandidates - $reviewedCandidates),
                'completeRound' => $totalCandidates > 0 && $reviewedCandidates === $totalCandidates,
            ],
            'places' => $places,
        ];
    }

    public function updateCandidate(string $placeId, string $candidateId, string $status, bool $isMain): array
    {
        if (!in_array($status, ['pending', 'approved', 'rejected'], true)) {
            throw new RuntimeException('Invalid image review status.');
        }

        $catalog = $this->catalog();
        $place = $this->findPlace($catalog, $placeId);
        $candidate = $this->findCandidate($place, $candidateId);
        if ($candidate === null) {
            throw new RuntimeException('Image candidate not found.');
        }

        $decisions = $this->readJson($this->decisionsFile, ['places' => []]);
        if (!isset($decisions['places'][$placeId]) || !is_array($decisions['places'][$placeId])) {
            $decisions['places'][$placeId] = [];
        }

        if ($isMain) {
            foreach ($decisions['places'][$placeId] as $id => $decision) {
                if (is_array($decision)) {
                    $decisions['places'][$placeId][$id]['isMain'] = false;
                }
            }
            $status = 'approved';
        }

        $decisions['places'][$placeId][$candidateId] = [
            'status' => $status,
            'isMain' => $status === 'approved' ? $isMain : false,
            'updatedAt' => gmdate('c'),
        ];
        $decisions['updatedAt'] = gmdate('c');
        $this->writeJson($this->decisionsFile, $decisions);

        return $this->catalog();
    }

    public function refreshPlace(string $placeId): array
    {
        $placesData = $this->readJson($this->placesFile, ['places' => []]);
        $place = null;
        foreach (($placesData['places'] ?? []) as $candidatePlace) {
            if (($candidatePlace['id'] ?? '') === $placeId) {
                $place = $candidatePlace;
                break;
            }
        }
        if (!is_array($place)) {
            throw new RuntimeException('Place not found.');
        }

        $extras = $this->readJson($this->extrasFile, ['places' => []]);
        $refreshCount = 0;
        $existingIndex = null;
        foreach (($extras['places'] ?? []) as $index => $entry) {
            if (($entry['id'] ?? '') === $placeId) {
                $existingIndex = $index;
                $refreshCount = (int) ($entry['refreshCount'] ?? 0);
                break;
            }
        }

        $queries = [
            sprintf('"%s" Morong Rizal', $place['name']),
            sprintf('%s %s Morong Rizal Philippines', $place['name'], $place['category'] ?? ''),
            sprintf('%s %s', $place['name'], $place['address'] ?? 'Morong Rizal'),
        ];
        $query = $queries[$refreshCount % count($queries)];
        $newCandidates = $this->searchWikimedia($query);

        $entry = [
            'id' => $placeId,
            'name' => $place['name'],
            'searchedAt' => gmdate('c'),
            'refreshCount' => $refreshCount + 1,
            'query' => $query,
            'candidates' => $newCandidates,
        ];

        if ($existingIndex === null) {
            $extras['places'][] = $entry;
        } else {
            $existing = $extras['places'][$existingIndex]['candidates'] ?? [];
            $merged = [];
            foreach (array_merge($existing, $newCandidates) as $candidate) {
                if (is_array($candidate) && !empty($candidate['originalUrl'])) {
                    $merged[$this->candidateId((string) $candidate['originalUrl'])] = $candidate;
                }
            }
            $entry['candidates'] = array_values($merged);
            $extras['places'][$existingIndex] = $entry;
        }

        $extras['updatedAt'] = gmdate('c');
        $this->writeJson($this->extrasFile, $extras);

        return $this->catalog();
    }

    public function finalize(): array
    {
        $catalog = $this->catalog();
        $manifest = [
            'generatedAt' => gmdate('c'),
            'sourcePolicy' => 'Only explicitly approved review candidates are downloaded.',
            'places' => [],
        ];
        $warnings = [];
        $downloaded = 0;

        if (!is_dir($this->outputRoot) && !mkdir($this->outputRoot, 0775, true) && !is_dir($this->outputRoot)) {
            throw new RuntimeException('Unable to create establishment image output directory.');
        }

        foreach ($catalog['places'] as $place) {
            $approved = array_values(array_filter(
                $place['candidates'],
                static fn (array $candidate): bool => $candidate['status'] === 'approved'
            ));
            if (!$approved) {
                $warnings[] = $place['name'] . ': no approved images';
                continue;
            }

            usort($approved, static function (array $a, array $b): int {
                return ((int) ($b['isMain'] ?? false)) <=> ((int) ($a['isMain'] ?? false));
            });

            if (!(bool) ($approved[0]['isMain'] ?? false)) {
                $warnings[] = $place['name'] . ': no main image selected; first approved image was used as main';
            }
            if (count($approved) < 3) {
                $warnings[] = $place['name'] . ': fewer than 3 approved images';
            }

            $placeDirectory = $this->outputRoot . DIRECTORY_SEPARATOR . $place['id'];
            if (!is_dir($placeDirectory) && !mkdir($placeDirectory, 0775, true) && !is_dir($placeDirectory)) {
                throw new RuntimeException('Unable to create image folder for ' . $place['name']);
            }

            $files = [];
            foreach ($approved as $index => $candidate) {
                $role = $index === 0 ? 'main' : ($index === 1 ? 'place' : ($index === 2 ? 'service' : 'extra-' . ($index + 1)));
                $extension = $this->extensionForCandidate($candidate);
                $filename = sprintf('%s-%02d-%s.%s', $place['id'], $index + 1, $role, $extension);
                $target = $placeDirectory . DIRECTORY_SEPARATOR . $filename;

                try {
                    $this->downloadImage((string) $candidate['originalUrl'], $target);
                    $downloaded++;
                    $files[] = [
                        'filename' => $filename,
                        'role' => $role,
                        'source' => $candidate['source'] ?? 'Wikimedia Commons',
                        'sourceUrl' => $candidate['descriptionUrl'] ?? $candidate['originalUrl'],
                        'originalUrl' => $candidate['originalUrl'],
                        'author' => $candidate['author'] ?? '',
                        'credit' => $candidate['credit'] ?? '',
                        'license' => $candidate['license'] ?? '',
                        'licenseUrl' => $candidate['licenseUrl'] ?? '',
                        'attributionRequired' => $candidate['attributionRequired'] ?? '',
                    ];
                } catch (RuntimeException $error) {
                    $warnings[] = $place['name'] . ': ' . $filename . ' failed - ' . $error->getMessage();
                }
            }

            $manifest['places'][] = [
                'id' => $place['id'],
                'name' => $place['name'],
                'files' => $files,
            ];
        }

        $manifestPath = $this->outputRoot . DIRECTORY_SEPARATOR . 'image-sources.json';
        $this->writeJson($manifestPath, $manifest);

        return [
            'ok' => true,
            'downloadedCount' => $downloaded,
            'outputPath' => $this->outputRoot,
            'manifestPath' => $manifestPath,
            'warnings' => $warnings,
        ];
    }

    private function searchWikimedia(string $query): array
    {
        $params = http_build_query([
            'action' => 'query',
            'format' => 'json',
            'generator' => 'search',
            'gsrsearch' => $query,
            'gsrnamespace' => '6',
            'gsrlimit' => '12',
            'prop' => 'imageinfo',
            'iiprop' => 'url|size|mime|extmetadata',
        ]);
        $url = 'https://commons.wikimedia.org/w/api.php?' . $params;

        $curl = curl_init($url);
        if ($curl === false) {
            throw new RuntimeException('Unable to initialize Wikimedia request.');
        }
        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT => 25,
            CURLOPT_HTTPHEADER => [
                'Accept: application/json',
                'User-Agent: SerbisYOPrototypeImageReview/1.0',
            ],
        ]);
        $body = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        $error = curl_error($curl);
        curl_close($curl);

        if ($body === false || $status >= 400) {
            throw new RuntimeException($status === 429
                ? 'Wikimedia rate limit reached. Try again shortly.'
                : 'Wikimedia search failed' . ($error !== '' ? ': ' . $error : '.'));
        }

        $decoded = json_decode($body, true);
        $pages = is_array($decoded['query']['pages'] ?? null) ? array_values($decoded['query']['pages']) : [];
        $results = [];

        foreach ($pages as $page) {
            $info = is_array($page['imageinfo'][0] ?? null) ? $page['imageinfo'][0] : [];
            $mime = (string) ($info['mime'] ?? '');
            if (!str_starts_with($mime, 'image/') || empty($info['url'])) {
                continue;
            }
            $metadata = is_array($info['extmetadata'] ?? null) ? $info['extmetadata'] : [];
            $value = static fn (string $key): string => trim(strip_tags((string) ($metadata[$key]['value'] ?? '')));
            $results[] = [
                'title' => (string) ($page['title'] ?? 'Untitled image'),
                'originalUrl' => (string) $info['url'],
                'descriptionUrl' => (string) ($info['descriptionurl'] ?? ''),
                'width' => $info['width'] ?? null,
                'height' => $info['height'] ?? null,
                'mime' => $mime,
                'author' => $value('Artist'),
                'credit' => $value('Credit'),
                'license' => $value('LicenseShortName') ?: $value('UsageTerms'),
                'licenseUrl' => $value('LicenseUrl'),
                'attributionRequired' => $value('AttributionRequired'),
                'description' => $value('ImageDescription'),
                'source' => 'Wikimedia Commons',
            ];
        }

        return $results;
    }

    private function downloadImage(string $url, string $target): void
    {
        $curl = curl_init($url);
        if ($curl === false) {
            throw new RuntimeException('Unable to initialize image download.');
        }
        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT => 45,
            CURLOPT_HTTPHEADER => ['User-Agent: SerbisYOPrototypeImageCollector/1.0'],
        ]);
        $body = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        $contentType = (string) curl_getinfo($curl, CURLINFO_CONTENT_TYPE);
        $error = curl_error($curl);
        curl_close($curl);

        if ($body === false || $status >= 400 || !str_starts_with(strtolower($contentType), 'image/')) {
            throw new RuntimeException($error !== '' ? $error : 'Remote source did not return an image.');
        }

        if (file_put_contents($target, $body, LOCK_EX) === false) {
            throw new RuntimeException('Unable to save downloaded image.');
        }
    }

    private function extensionForCandidate(array $candidate): string
    {
        return match (strtolower((string) ($candidate['mime'] ?? ''))) {
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
            default => 'jpg',
        };
    }

    private function findPlace(array $catalog, string $placeId): array
    {
        foreach ($catalog['places'] as $place) {
            if (($place['id'] ?? '') === $placeId) {
                return $place;
            }
        }
        throw new RuntimeException('Place not found.');
    }

    private function findCandidate(array $place, string $candidateId): ?array
    {
        foreach (($place['candidates'] ?? []) as $candidate) {
            if (($candidate['id'] ?? '') === $candidateId) {
                return $candidate;
            }
        }
        return null;
    }

    private function candidateId(string $url): string
    {
        return 'img_' . substr(sha1($url), 0, 16);
    }

    private function readJson(string $path, array $fallback): array
    {
        if (!is_file($path)) {
            return $fallback;
        }
        $contents = file_get_contents($path);
        if ($contents === false || trim($contents) === '') {
            return $fallback;
        }
        $decoded = json_decode($contents, true);
        return is_array($decoded) ? $decoded : $fallback;
    }

    private function writeJson(string $path, array $payload): void
    {
        $directory = dirname($path);
        if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
            throw new RuntimeException('Unable to create image-review storage directory.');
        }
        $json = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($json === false || file_put_contents($path, $json . PHP_EOL, LOCK_EX) === false) {
            throw new RuntimeException('Unable to write image-review data.');
        }
    }
}

