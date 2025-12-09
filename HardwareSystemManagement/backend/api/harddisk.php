<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../controllers/HardDiskController.php';

$hardDiskController = new HardDiskController();

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';
$id = isset($_GET['id']) ? $_GET['id'] : null;

switch($method) {
    case 'GET':
        if ($action === 'get' && $id) {
            // Get one hard disk
            $hardDisk = $hardDiskController->readOne($id);
            if ($hardDisk) {
                echo json_encode(array("status" => "success", "data" => $hardDisk));
            } else {
                echo json_encode(array("status" => "error", "message" => "Hard disk not found"));
            }
        } else if ($action === 'read' || empty($action)) {
            // Get all hard disks
            $hardDisks = $hardDiskController->readAll();
            echo json_encode(array("status" => "success", "data" => $hardDisks));
        } else {
            echo json_encode(array("status" => "error", "message" => "Invalid action"));
        }
        break;
        
    case 'POST':
        // Create or update hard disk
        $data = json_decode(file_get_contents("php://input"));
        
        if ($action === 'update' && $id) {
            // Update hard disk
            $data->id = $id;
            if ($hardDiskController->update($data)) {
                echo json_encode(array("status" => "success", "message" => "Hard disk updated successfully"));
            } else {
                echo json_encode(array("status" => "error", "message" => "Failed to update hard disk"));
            }
        } else if ($action === 'create') {
            // Create hard disk
            if ($hardDiskController->create($data)) {
                echo json_encode(array("status" => "success", "message" => "Hard disk created successfully"));
            } else {
                echo json_encode(array("status" => "error", "message" => "Failed to create hard disk"));
            }
        } else {
            echo json_encode(array("status" => "error", "message" => "Invalid action"));
        }
        break;
        
    case 'DELETE':
        // Delete hard disk
        if ($id) {
            if ($hardDiskController->delete($id)) {
                echo json_encode(array("status" => "success", "message" => "Hard disk deleted successfully"));
            } else {
                echo json_encode(array("status" => "error", "message" => "Failed to delete hard disk"));
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
