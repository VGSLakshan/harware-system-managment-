<?php
include_once "../models/CPUFan.php";

class CPUFanController {
    private $cpuFan;

    public function __construct($db) {
        $this->cpuFan = new CPUFan($db);
    }

    public function create($data) {
        if (empty($data['brand_name']) || empty($data['model']) || 
            empty($data['quantity_available']) || empty($data['purchase_date'])) {
            echo json_encode(["status" => "error", "message" => "Please fill all required fields"]);
            return;
        }

        if ($this->cpuFan->create($data)) {
            echo json_encode(["status" => "success", "message" => "CPU Fan added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to add CPU Fan"]);
        }
    }

    public function read() {
        $result = $this->cpuFan->read();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode(["status" => "success", "data" => $data]);
    }

    public function getById($id) {
        $row = $this->cpuFan->getById($id);
        if ($row) {
            echo json_encode(["status" => "success", "data" => $row]);
        } else {
            echo json_encode(["status" => "error", "message" => "CPU Fan not found"]);
        }
    }

    public function update($id, $data) {
        if ($this->cpuFan->update($id, $data)) {
            echo json_encode(["status" => "success", "message" => "CPU Fan updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update CPU Fan"]);
        }
    }

    public function delete($id) {
        if ($this->cpuFan->delete($id)) {
            echo json_encode(["status" => "success", "message" => "CPU Fan deleted successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to delete CPU Fan"]);
        }
    }
}
?>