<?php

declare(strict_types=1);

spl_autoload_register(static function (string $class): void {
    $prefix = 'SerbisYO\\';

    if (!str_starts_with($class, $prefix)) {
        return;
    }

    $relativeClass = substr($class, strlen($prefix));
    $path = __DIR__ . '/' . str_replace('\\', '/', $relativeClass) . '.php';

    if (is_file($path)) {
        require $path;
    }
});

SerbisYO\Config\Env::load(dirname(__DIR__) . '/.env');
