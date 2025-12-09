<?php
include_once "../models/Mouse.php";

class MouseController {
    private $mouse;

    public function __construct($db) {
        $this->mouse = new Mouse($db);
    }

    public function create($data) {
        try {
            // Validate required fields
            if(empty($data['brand_name']) || empty($data['model']) || 
               empty($data['quantity_available']) || empty($data['purchase_date'])){
                echo json_encode(["status"=>"error","message"=>"Please fill all required fields"]);
                return;
            }
            
            // Debug: Log create attempt
            file_put_contents('../logs/debug.log', date('Y-m-d H:i:s') . " - Creating mouse with data: " . print_r($data, true) . "\n", FILE_APPEND);

            if ($this->mouse->create($data)) {
                echo json_encode(["status"=>"success", "message"=>"Mouse added successfully"]);
            } else {
                // Get the actual MySQL error
                $errorMessage = $this->mouse->getLastError();
                echo json_encode(["status"=>"error", "message"=>"Failed to add mouse: " . $errorMessage]);
            }
        } catch (Exception $e) {
            file_put_contents('../logs/error.log', date('Y-m-d H:i:s') . " - Controller Error: " . $e->getMessage() . "\n", FILE_APPEND);
            echo json_encode(["status"=>"error", "message"=>$e->getMessage()]);
        }
    }

    public function read() {
        $result = $this->mouse->read();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode(["status"=>"success", "data"=>$data]);
    }

    public function getById($id) {
        $row = $this->mouse->getById($id);
        if($row) echo json_encode(["status"=>"success", "data"=>$row]);
        else echo json_encode(["status"=>"error", "message"=>"Mouse not found"]);
    }

    public function update($id, $data) {
        if ($this->mouse->update($id, $data)) {
            echo json_encode(["status"=>"success", "message"=>"Mouse updated successfully"]);
        } else {
            echo json_encode(["status"=>"error", "message"=>"Failed to update mouse"]);
        }
    }

    public function delete($id) {
        if ($this->mouse->delete($id)) {
            echo json_encode(["status"=>"success", "message"=>"Mouse deleted successfully"]);
        } else {
            echo json_encode(["status"=>"error", "message"=>"Failed to delete mouse"]);
        }
    }
}
?>
