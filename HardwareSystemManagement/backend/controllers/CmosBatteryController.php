<?php
include_once "../models/CmosBattery.php";

class CmosBatteryController {
    private $cmosBattery;

    public function __construct($db) {
        $this->cmosBattery = new CmosBattery($db);
    }

    public function create($data) {
        if (empty($data['brand_name']) || empty($data['model']) || 
            empty($data['quantity_available']) || empty($data['purchase_date'])) {
            echo json_encode(["status" => "error", "message" => "Please fill all required fields"]);
            return;
        }

        if ($this->cmosBattery->create($data)) {
            echo json_encode(["status" => "success", "message" => "CMOS Battery added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to add CMOS Battery"]);
        }
    }

    public function read() {
        $result = $this->cmosBattery->read();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode(["status" => "success", "data" => $data]);
    }

    public function getById($id) {
        $row = $this->cmosBattery->getById($id);
        if ($row) {
            echo json_encode(["status" => "success", "data" => $row]);
        } else {
            echo json_encode(["status" => "error", "message" => "CMOS Battery not found"]);
        }
    }

    public function update($id, $data) {
        if ($this->cmosBattery->update($id, $data)) {
            echo json_encode(["status" => "success", "message" => "CMOS Battery updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update CMOS Battery"]);
        }
    }

    public function delete($id) {
        if ($this->cmosBattery->delete($id)) {
            echo json_encode(["status" => "success", "message" => "CMOS Battery deleted successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to delete CMOS Battery"]);
        }
    }
}
?>
