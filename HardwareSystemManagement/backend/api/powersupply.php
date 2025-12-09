<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../controllers/PowerSupplyController.php';

$powerSupplyController = new PowerSupplyController();

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';
$id = isset($_GET['id']) ? $_GET['id'] : null;

switch($method) {
    case 'GET':
        if ($action === 'get' && $id) {
            // Get one power supply
            $powerSupply = $powerSupplyController->readOne($id);
            if ($powerSupply) {
                echo json_encode(array("status" => "success", "data" => $powerSupply));
            } else {
                echo json_encode(array("status" => "error", "message" => "Power supply not found"));
            }
        } else {
            // Get all power supplies
            $powerSupplies = $powerSupplyController->readAll();
            echo json_encode(array("status" => "success", "data" => $powerSupplies));
        }
        break;
        
    case 'POST':
        // Create or update power supply
        $data = json_decode(file_get_contents("php://input"));
        
        if ($action === 'update' && $id) {
            // Update power supply
            $data->id = $id;
            if ($powerSupplyController->update($data)) {
                echo json_encode(array("status" => "success", "message" => "Power supply updated successfully"));
            } else {
                echo json_encode(array("status" => "error", "message" => "Failed to update power supply"));
            }
        } else if ($action === 'create') {
            // Create power supply
            if ($powerSupplyController->create($data)) {
                echo json_encode(array("status" => "success", "message" => "Power supply created successfully"));
            } else {
                echo json_encode(array("status" => "error", "message" => "Failed to create power supply"));
            }
        } else {
            echo json_encode(array("status" => "error", "message" => "Invalid action"));
        }
        break;
        
    case 'DELETE':
        // Delete power supply
        if ($id) {
            if ($powerSupplyController->delete($id)) {
                echo json_encode(array("status" => "success", "message" => "Power supply deleted successfully"));
            } else {
                echo json_encode(array("status" => "error", "message" => "Failed to delete power supply"));
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