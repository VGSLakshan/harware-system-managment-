<?php
class Keyboard {
    private $conn;
    private $table_name = "keyboard";

    public function __construct($db) {
        $this->conn = $db;
    }

    // CREATE
    public function create($data) {
        $sql = "INSERT INTO {$this->table_name}
                (brand_name, model, quantity_available, purchase_date, serial_no, su_no, remark)
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        if (!$stmt) { throw new Exception("Prepare failed: ".$this->conn->error); }

        // ✅ assign to real variables (no expressions inside bind_param)
        $brand_name         = isset($data['brand_name']) ? (string)$data['brand_name'] : '';
        $model              = isset($data['model']) ? (string)$data['model'] : '';
        $quantity_available = isset($data['quantity_available']) ? (int)$data['quantity_available'] : 0;
        $purchase_date      = isset($data['purchase_date']) ? (string)$data['purchase_date'] : null;

        // Allow NULLs: convert empty string to NULL
        $serial_no = (isset($data['serial_no']) && $data['serial_no'] !== '') ? (string)$data['serial_no'] : null;
        $su_no     = (isset($data['su_no']) && $data['su_no'] !== '') ? (string)$data['su_no'] : null;
        $remark    = (isset($data['remark']) && $data['remark'] !== '') ? (string)$data['remark'] : null;

        // types: s=string, i=int (7 placeholders → "ssissss")
        if (!$stmt->bind_param(
            "ssissss",
            $brand_name,
            $model,
            $quantity_available,
            $purchase_date,
            $serial_no,
            $su_no,
            $remark
        )) {
            throw new Exception("bind_param failed: ".$stmt->error);
        }

        if (!$stmt->execute()) {
            throw new Exception("Execute failed: ".$stmt->error);
        }
        return true;
    }

    // READ ALL
    public function read() {
        $sql = "SELECT * FROM {$this->table_name} ORDER BY id DESC";
        return $this->conn->query($sql);
    }

    // GET BY ID
    public function getById($id) {
        $sql = "SELECT * FROM {$this->table_name} WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // UPDATE
    public function update($id, $data) {
        $sql = "UPDATE {$this->table_name}
                SET brand_name=?, model=?, quantity_available=?, purchase_date=?, serial_no=?, su_no=?, remark=?
                WHERE id=?";
        $stmt = $this->conn->prepare($sql);
        if (!$stmt) { throw new Exception("Prepare failed: ".$this->conn->error); }

        $brand_name         = isset($data['brand_name']) ? (string)$data['brand_name'] : '';
        $model              = isset($data['model']) ? (string)$data['model'] : '';
        $quantity_available = isset($data['quantity_available']) ? (int)$data['quantity_available'] : 0;
        $purchase_date      = isset($data['purchase_date']) ? (string)$data['purchase_date'] : null;
        $serial_no          = (isset($data['serial_no']) && $data['serial_no'] !== '') ? (string)$data['serial_no'] : null;
        $su_no              = (isset($data['su_no']) && $data['su_no'] !== '') ? (string)$data['su_no'] : null;
        $remark             = (isset($data['remark']) && $data['remark'] !== '') ? (string)$data['remark'] : null;

        if (!$stmt->bind_param(
            "ssissssi",
            $brand_name,
            $model,
            $quantity_available,
            $purchase_date,
            $serial_no,
            $su_no,
            $remark,
            $id
        )) {
            throw new Exception("bind_param failed: ".$stmt->error);
        }

        if (!$stmt->execute()) {
            throw new Exception("Execute failed: ".$stmt->error);
        }
        return true;
    }

    // DELETE
    public function delete($id) {
        $sql = "DELETE FROM {$this->table_name} WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
