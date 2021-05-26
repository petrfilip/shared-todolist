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


    static public function microseconds() {
        $mt = explode(' ', microtime());
        return ((int)$mt[1]) * 1000000 + ((int)round($mt[0] * 1000000));
    }

}