<?php

declare(strict_types=1);

namespace SerbisYO\Config;

final class Env
{
    public static function load(string $path): void
    {
        if (!is_file($path)) {
            return;
        }

        $values = parse_ini_file($path, false, INI_SCANNER_RAW);

        if ($values === false) {
            return;
        }

        foreach ($values as $key => $value) {
            if (getenv((string) $key) !== false) {
                continue;
            }

            $stringValue = (string) $value;
            putenv($key . '=' . $stringValue);
            $_ENV[$key] = $stringValue;
        }
    }

    public static function get(string $key, ?string $default = null): ?string
    {
        $value = getenv($key);

        return $value === false ? $default : $value;
    }
}
