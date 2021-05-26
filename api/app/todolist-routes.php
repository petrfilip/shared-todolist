<?php
declare(strict_types=1);

use App\LessonRepository;
use App\TodoListRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {

    $app->group('/todolist', function (Group $group) {


        /**
         * Get by UUID
         */
        $group->get('/{uuid}', function (Request $request, Response $response, $args) {
            $todoList = TodoListRepository::getById(intval($args["uuid"]));

            if (empty($todoList)) {
                throw new Exception("Todo list not found!");
            }

            $payload = json_encode($todoList);
            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        });

        /**
         * Insert new TODO list
         */
        $group->post('', function (Request $request, Response $response, $args) {
            $requestData = $request->getParsedBody();

            $newTodolist = array();
            $newTodolist["taskList"] = array();

            $newTodolist["title"] = substr($requestData["title"], 0, 255);
            for ($i = 0; $i <= sizeof($requestData["taskList"])-1; $i++) {
                $newTodolist["taskList"]["title"] = substr($requestData["taskList"][$i]["title"], 0, 255);
                $newTodolist["taskList"]["isCompleted"] = false;
            }


            $inserted = TodoListRepository::insertOrUpdate($requestData);
            $payload = json_encode($inserted);

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        });

        /**
         * Update state by UUID and INDEX
         */
        $group->patch('/{uuid}', function (Request $request, Response $response, $args) {
            $todoList = TodoListRepository::getById($args["uuid"]);
            $dataToUpdate = $request->getParsedBody();

            $todoList["taskList"][intval($dataToUpdate["index"])]["isCompleted"] = filter_var($dataToUpdate["state"], FILTER_VALIDATE_BOOLEAN);

            TodoListRepository::insertOrUpdate($todoList);

            $response->getBody()->write("");
            return $response->withStatus(200);
        });


    });
};