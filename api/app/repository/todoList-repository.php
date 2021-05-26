<?php

namespace App;

use SleekDB\Store;

final class TodoListRepository
{
    const REPOSITORY_NAME = 'todolist';

    static public function getDataStore(): Store
    {
        return new Store(self::REPOSITORY_NAME, DATABASE_ROOT);
    }


    static public function getById($id): array
    {
        $condition = ["uuid", "===", intval($id)];
        return self::getDataStore()->findOneBy($condition);
    }

    static public function insertOrUpdate($data): array
    {
        $data = (array)$data;
        if (empty($data["uuid"])) {
            $data["uuid"] = abs(crc32(uniqid()));;
        } else {
            $data["_id"] = self::getById(intval($data["uuid"]))["_id"];
        }
        return DatabaseManager::insertOrUpdateVersionedRecord(self::REPOSITORY_NAME, $data, 0);
    }


}