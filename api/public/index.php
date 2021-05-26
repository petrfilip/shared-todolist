<?php

use App\Middleware\CorsMiddleware;
use App\Middleware\HttpExceptionMiddleware;
use DI\ContainerBuilder;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Log\LoggerInterface;
use Slim\App;
use Slim\Exception\HttpNotFoundException;


require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . './../app/middleware/CorsMiddleware.php';

require __DIR__ . '/../app/repository/DatabaseManager.php';
require __DIR__ . '/../app/repository/todoList-repository.php';
require __DIR__ . '/../app/Utils.php';



define("DATABASE_ROOT", __DIR__ . "/../database");

$containerBuilder = new ContainerBuilder();

// Add container definitions
$containerBuilder->addDefinitions(__DIR__ . '/container.php');

// Build PHP-DI Container instance
$container = $containerBuilder->build();

$app = $container->get(App::class);
$app->add(CorsMiddleware::class);

$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();
$app->setBasePath("/api/public");


// Define Custom Error Handler
$customErrorHandler = function (
    ServerRequestInterface $request,
    Throwable $exception,
    bool $displayErrorDetails,
    bool $logErrors,
    bool $logErrorDetails,
    ?LoggerInterface $logger = null
) use ($app) {
//    $logger->error($exception->getMessage());

    $payload = ['error' => $exception->getMessage()];

    $response = $app->getResponseFactory()->createResponse();

    $requestHeaders = $request->getHeaderLine('Access-Control-Request-Headers');

    $response = $response->withHeader('Access-Control-Allow-Origin', '*');
    $response = $response->withHeader('Access-Control-Allow-Methods', '*');
    $response = $response->withHeader('Access-Control-Allow-Headers', $requestHeaders ?: '*');

    // Allow Ajax CORS requests with Authorization header
    $response = $response->withHeader('Access-Control-Allow-Credentials', 'true');
    $response = $response->withHeader('Access-Control-Expose-Headers', 'Content-Disposition, Content-Type, X-Filename');

    $response->getBody()->write(json_encode($payload, JSON_UNESCAPED_UNICODE));
    return $response->withStatus(500);
};


$errorMiddleware = $app->addErrorMiddleware(true, true, true);
$errorMiddleware->setDefaultErrorHandler($customErrorHandler);

$app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Hello");
    return $response;
});

$coursesRoutes = require __DIR__ . '/../app/todolist-routes.php';
$coursesRoutes($app);

$app->options('/{routes:.+}', function (Request $request, Response $response, $args) {
    $response = $response->withHeader('Content-Type', 'application/json');
    return $response;
});

$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($request, $response) {
    throw new HttpNotFoundException($request);
});

$app->run();