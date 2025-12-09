<?php
// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// CORS & JSON headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Include dependencies
require_once "../config/db.php";
require_once "../controllers/CmosBatteryController.php";

try {
    $database = new Database();
    $db = $database->getConnection();
    $cmosBatteryController = new CmosBatteryController($db);

    $action = $_GET['action'] ?? '';

    switch($action) {
        case 'create':
            $data = json_decode(file_get_contents("php://input"), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid JSON data');
            }
            $cmosBatteryController->create($data);
            break;

        case 'read':
            $cmosBatteryController->read();
            break;

        case 'get':
            $id = $_GET['id'] ?? 0;
            $cmosBatteryController->getById($id);
            break;

        case 'update':
            $id = $_GET['id'] ?? 0;
            $data = json_decode(file_get_contents("php://input"), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid JSON data');
            }
            $cmosBatteryController->update($id, $data);
            break;

        case 'delete':
            $id = $_GET['id'] ?? 0;
            $cmosBatteryController->delete($id);
            break;

        default:
            echo json_encode(["status" => "error", "message" => "Invalid action"]);
    }
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
