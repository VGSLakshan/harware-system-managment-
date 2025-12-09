<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../controllers/RAMController.php';

$ramController = new RAMController();

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';
$id = isset($_GET['id']) ? $_GET['id'] : null;

switch($method) {
    case 'GET':
        if ($action === 'get' && $id) {
            // Get one RAM
            $ram = $ramController->readOne($id);
            if ($ram) {
                echo json_encode(array("status" => "success", "data" => $ram));
            } else {
                echo json_encode(array("status" => "error", "message" => "RAM not found"));
            }
        } else {
            // Get all RAMs
            $rams = $ramController->readAll();
            echo json_encode(array("status" => "success", "data" => $rams));
        }
        break;
        
    case 'POST':
        // Create or update RAM
        $data = json_decode(file_get_contents("php://input"));
        
        if ($action === 'update' && $id) {
            // Update RAM
            $data->id = $id;
            if ($ramController->update($data)) {
                echo json_encode(array("status" => "success", "message" => "RAM updated successfully"));
            } else {
                echo json_encode(array("status" => "error", "message" => "Failed to update RAM"));
            }
        } else if ($action === 'create') {
            // Create RAM
            if ($ramController->create($data)) {
                echo json_encode(array("status" => "success", "message" => "RAM created successfully"));
            } else {
                echo json_encode(array("status" => "error", "message" => "Failed to create RAM"));
            }
        } else {
            echo json_encode(array("status" => "error", "message" => "Invalid action"));
        }
        break;
        
    case 'DELETE':
        // Delete RAM
        if ($id) {
            if ($ramController->delete($id)) {
                echo json_encode(array("status" => "success", "message" => "RAM deleted successfully"));
            } else {
                echo json_encode(array("status" => "error", "message" => "Failed to delete RAM"));
            }
        } else {
            echo json_encode(array("status" => "error", "message" => "ID is required for deletion"));
        }
        break;
        
    default:
        echo json_encode(array("status" => "error", "message" => "Method not allowed"));
        break;
}
?>