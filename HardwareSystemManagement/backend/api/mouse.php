<?php
// Enable detailed error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set proper headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Debug: Log the request
$requestData = file_get_contents("php://input");
file_put_contents('../logs/request_data.log', date('Y-m-d H:i:s') . " - Request: " . $requestData . "\n", FILE_APPEND);

try {
    require_once "../config/db.php";
    require_once "../controllers/MouseController.php";

    $database = new Database();
    $db = $database->getConnection();
    $mouseController = new MouseController($db);

    $action = $_GET['action'] ?? '';

    // Debug: Log the action
    file_put_contents('../logs/debug.log', date('Y-m-d H:i:s') . " - Action: " . $action . "\n", FILE_APPEND);

    switch($action){
        case 'create':
            $data = json_decode(file_get_contents("php://input"), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid JSON data: ' . json_last_error_msg());
            }

            // Debug: Log the parsed data
            file_put_contents('../logs/debug.log', date('Y-m-d H:i:s') . " - Data: " . print_r($data, true) . "\n", FILE_APPEND);

            $mouseController->create($data);
            break;

        case 'read':
            $mouseController->read();
            break;

        case 'get':
            $id = $_GET['id'] ?? 0;
            $mouseController->getById($id);
            break;

        case 'update':
            $id = $_GET['id'] ?? 0;
            $data = json_decode(file_get_contents("php://input"), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid JSON data');
            }
            $mouseController->update($id, $data);
            break;

        case 'delete':
            $id = $_GET['id'] ?? 0;
            $mouseController->delete($id);
            break;

        default:
            echo json_encode(["status"=>"error","message"=>"Invalid action"]);
    }
} catch (Exception $e) {
    // Log and return error
    file_put_contents('../logs/error.log', date('Y-m-d H:i:s') . " - Error: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n", FILE_APPEND);

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
