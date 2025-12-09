<?php
include_once "../models/Keyboard.php";

class KeyboardController {
    private $keyboard;

    public function __construct($db) {
        $this->keyboard = new Keyboard($db);
    }

    public function create($data) {
        if (empty($data['brand_name']) || empty($data['model']) || 
            empty($data['quantity_available']) || empty($data['purchase_date'])) {
            echo json_encode(["status" => "error", "message" => "Please fill all required fields"]);
            return;
        }

        if ($this->keyboard->create($data)) {
            echo json_encode(["status" => "success", "message" => "Keyboard added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to add keyboard"]);
        }
    }

    public function read() {
        $result = $this->keyboard->read();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode(["status" => "success", "data" => $data]);
    }

    public function getById($id) {
        $row = $this->keyboard->getById($id);
        if ($row) {
            echo json_encode(["status" => "success", "data" => $row]);
        } else {
            echo json_encode(["status" => "error", "message" => "Keyboard not found"]);
        }
    }

    public function update($id, $data) {
        if ($this->keyboard->update($id, $data)) {
            echo json_encode(["status" => "success", "message" => "Keyboard updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update keyboard"]);
        }
    }

    public function delete($id) {
        if ($this->keyboard->delete($id)) {
            echo json_encode(["status" => "success", "message" => "Keyboard deleted successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to delete keyboard"]);
        }
    }
}
?>
