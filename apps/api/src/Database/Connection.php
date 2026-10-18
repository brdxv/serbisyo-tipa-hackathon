<?php

declare(strict_types=1);

namespace SerbisYO\Database;

use PDO;
use RuntimeException;
use SerbisYO\Config\Env;

final class Connection
{
    private static ?PDO $connection = null;

    public static function get(): PDO
    {
        if (self::$connection instanceof PDO) {
            return self::$connection;
        }

        if (!extension_loaded('pdo_pgsql')) {
            throw new RuntimeException(
                'The PHP pdo_pgsql extension is required to connect to PostgreSQL.'
            );
        }

        $host = Env::get('DB_HOST', '127.0.0.1');
        $port = Env::get('DB_PORT', '5432');
        $name = Env::get('DB_NAME', 'serbisyo');
        $user = Env::get('DB_USER', 'postgres');
        $password = Env::get('DB_PASSWORD', '');

        $dsn = sprintf('pgsql:host=%s;port=%s;dbname=%s', $host, $port, $name);

        self::$connection = new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        return self::$connection;
    }
}
