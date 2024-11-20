<?php
function loadEnv($path)
{
    // Check if the file exists
    if (!file_exists($path)) {
        throw new Exception("The .env file does not exist at path: $path");
    }

    // Read the file line by line
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        // Skip the line if it's a comment
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        // Parse the line
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);

        $value = trim($value, '"');

        putenv("$name=$value");
        $_ENV[$name] = $value;
        $_SERVER[$name] = $value;
    }
}
