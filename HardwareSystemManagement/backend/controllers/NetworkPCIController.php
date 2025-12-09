<?php
include_once "../models/NetworkPci.php";

class NetworkPciController {
    private $networkPci;

    public function __construct($db) {
        $this->networkPci = new NetworkPci($db);
    }

    public function create($data) {
        if (empty($data['brand_name']) || empty($data['model']) || 
            empty($data['quantity_available']) || empty($data['purchase_date'])) {
            echo json_encode(["status" => "error", "message" => "Please fill all required fields"]);
            return;
        }

        if ($this->networkPci->create($data)) {
            echo json_encode(["status" => "success", "message" => "Network PCI added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to add Network PCI"]);
        }
    }

    public function read() {
        $result = $this->networkPci->read();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode(["status" => "success", "data" => $data]);
    }

    public function getById($id) {
        $row = $this->networkPci->getById($id);
        if ($row) {
            echo json_encode(["status" => "success", "data" => $row]);
        } else {
            echo json_encode(["status" => "error", "message" => "Network PCI not found"]);
        }
    }

    public function update($id, $data) {
        if ($this->networkPci->update($id, $data)) {
            echo json_encode(["status" => "success", "message" => "Network PCI updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update Network PCI"]);
        }
    }

    public function delete($id) {
        if ($this->networkPci->delete($id)) {
            echo json_encode(["status" => "success", "message" => "Network PCI deleted successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to delete Network PCI"]);
        }
    }
}
?>
