<?php

namespace App;

use DateTime;
use Slim\Psr7\UploadedFile;
use stdClass;

final class Utils
{

    static public function getCurrentDateTime()
    {
        $date = new DateTime();
        return $date->format('Y-m-d H:i:s');
    }

    static public function isApplicationInitialized()
    {
        return defined("JWT_KEY");
    }

    static public function isPasswordValid($password) : bool {
        return strlen($password) > 3;
    }

    static public function randomPassword(): string {
        $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        $pass = array(); //remember to declare $pass as an array
        $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
        for ($i = 0; $i < 50; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        return implode($pass); //turn the array into a string
    }


    static public function microseconds() {
        $mt = explode(' ', microtime());
        return ((int)$mt[1]) * 1000000 + ((int)round($mt[0] * 1000000));
    }


    function random_str(int $length = 64, string $keyspace = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'): string {
        if ($length < 1) {
            throw new \RangeException("Length must be a positive integer");
        }
        $pieces = [];
        $max = mb_strlen($keyspace, '8bit') - 1;
        for ($i = 0; $i < $length; ++$i) {
            $pieces []= $keyspace[random_int(0, $max)];
        }
        return implode('', $pieces);
    }

    static public function slugify($text)
    {
        // Strip html tags
        $text = strip_tags($text);
        // Replace non letter or digits by -
        $text = preg_replace('~[^\pL\d]+~u', '-', $text);
        // Transliterate
        setlocale(LC_ALL, 'en_US.utf8');
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
        // Remove unwanted characters
        $text = preg_replace('~[^-\w]+~', '', $text);
        // Trim
        $text = trim($text, '-');
        // Remove duplicate -
        $text = preg_replace('~-+~', '-', $text);
        // Lowercase
        $text = strtolower($text);
        // Check if it is empty
        if (empty($text)) {
            return 'n-a';
        }
        // Return result
        return $text;
    }


    function folderExists($folder)
    {
        $path = realpath($folder);

        return ($path !== false && is_dir($path)) ? $path : false;
    }

    static public function moveUploadedFile($location, UploadedFile $uploadedFile)
    {
        $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
        $slugName = pathinfo($uploadedFile->getClientFilename(), PATHINFO_FILENAME);
        $slugName = Utils::slugify($slugName);

        $slugName = sprintf('%s.%0.8s', $slugName, $extension);

        $relativePath = $location ;

        /* avoid two slashes in path*/
        if (strlen($location) === 1) {
            $location = "";
        }
        $publicPath = MEDIA_STORAGE . $location . DIRECTORY_SEPARATOR . $slugName;
        $realPathToSave = MEDIA_STORAGE_ROOT . $location . DIRECTORY_SEPARATOR . $slugName;
        $uploadedFile->moveTo($realPathToSave);

        $media = new stdClass();
        $media->type = "file";
        $media->originName = $uploadedFile->getClientFilename();
        $media->slugName = $slugName;
        $media->path = $relativePath;
        $media->publicPath = $publicPath;
        $media->attributes = [
            'size' => $uploadedFile->getSize(),
            'mimeType' => $uploadedFile->getClientMediaType(),
//            'fileType' => MIME::group($uploadedFile->getClientMediaType())
        ];
        return $media;
    }



}