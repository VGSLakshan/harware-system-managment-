<?php
class Mouse {
    private $conn;
    private $table_name = "mouse";
    private $lastError = "";

    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getLastError() {
        return $this->lastError ?: $this->conn->error;
    }

    public function create($data) {
        try {
            // Debug: Log database connection status
            file_put_contents('../logs/debug.log', date('Y-m-d H:i:s') . " - DB Connection: " . ($this->conn->connect_error ? "Error: " . $this->conn->connect_error : "OK") . "\n", FILE_APPEND);
            
            // Check table structure
            $tableQuery = "DESCRIBE " . $this->table_name;
            $tableResult = $this->conn->query($tableQuery);
            
            if (!$tableResult) {
                $this->lastError = "Table query failed: " . $this->conn->error;
                file_put_contents('../logs/debug.log', date('Y-m-d H:i:s') . " - " . $this->lastError . "\n", FILE_APPEND);
                return false;
            }
            
            // Log table structure
            $columns = [];
            while ($row = $tableResult->fetch_assoc()) {
                $columns[] = $row['Field'];
            }
            file_put_contents('../logs/debug.log', date('Y-m-d H:i:s') . " - Table columns: " . implode(", ", $columns) . "\n", FILE_APPEND);
            
            // Get values from data array
            $brand_name = $data['brand_name'];
            $model = $data['model'];
            $quantity_available = $data['quantity_available'];
            $purchase_date = $data['purchase_date'];
            $serial_no = $data['serial_no'] ?? null;
            $su_no = $data['su_no'] ?? null;
            
            // Check for remarks or remark field
            $hasRemarks = in_array('remarks', $columns);
            $hasRemark = in_array('remark', $columns);
            
            // Use the correct field name based on what's in the data and what's in the DB
            if ($hasRemarks) {
                $remarks = $data['remarks'] ?? ($data['remark'] ?? null);
                $query = "INSERT INTO " . $this->table_name . " 
                         (brand_name, model, quantity_available, purchase_date, serial_no, su_no, remarks)
                         VALUES (?, ?, ?, ?, ?, ?, ?)";
                $stmt = $this->conn->prepare($query);
                $stmt->bind_param(
                    "ssissss", 
                    $brand_name, 
                    $model, 
                    $quantity_available, 
                    $purchase_date, 
                    $serial_no, 
                    $su_no, 
                    $remarks
                );
            } elseif ($hasRemark) {
                $remark = $data['remark'] ?? ($data['remarks'] ?? null);
                $query = "INSERT INTO " . $this->table_name . " 
                         (brand_name, model, quantity_available, purchase_date, serial_no, su_no, remark)
                         VALUES (?, ?, ?, ?, ?, ?, ?)";
                $stmt = $this->conn->prepare($query);
                $stmt->bind_param(
                    "ssissss", 
                    $brand_name, 
                    $model, 
                    $quantity_available, 
                    $purchase_date, 
                    $serial_no, 
                    $su_no, 
                    $remark
                );
            } else {
                $query = "INSERT INTO " . $this->table_name . " 
                         (brand_name, model, quantity_available, purchase_date, serial_no, su_no)
                         VALUES (?, ?, ?, ?, ?, ?)";
                $stmt = $this->conn->prepare($query);
                $stmt->bind_param(
                    "ssiss", 
                    $brand_name, 
                    $model, 
                    $quantity_available, 
                    $purchase_date, 
                    $serial_no, 
                    $su_no
                );
            }
            
            $result = $stmt->execute();
            
            if (!$result) {
                $this->lastError = "Execute failed: " . $stmt->error;
                file_put_contents('../logs/debug.log', date('Y-m-d H:i:s') . " - " . $this->lastError . "\n", FILE_APPEND);
                return false;
            }
            
            return $result;
            
        } catch (Exception $e) {
            $this->lastError = $e->getMessage();
            file_put_contents('../logs/error.log', date('Y-m-d H:i:s') . " - Model Error: " . $e->getMessage() . "\n", FILE_APPEND);
            return false;
        }
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY id DESC";
        return $this->conn->query($query);
    }

    public function getById($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function update($id, $data) {
        // Create local variables that can be passed by reference
        $brand_name = isset($data['brand_name']) ? $data['brand_name'] : '';
        $model = isset($data['model']) ? $data['model'] : '';
        $quantity_available = isset($data['quantity_available']) ? intval($data['quantity_available']) : 0;
        $purchase_date = isset($data['purchase_date']) ? $data['purchase_date'] : '';
        $serial_no = isset($data['serial_no']) ? $data['serial_no'] : null;
        $su_no = isset($data['su_no']) ? $data['su_no'] : null;
        $remark = isset($data['remark']) ? $data['remark'] : null;
        $id_param = intval($id);

        $query = "UPDATE " . $this->table_name . " 
                  SET brand_name=?, model=?, quantity_available=?, purchase_date=?, serial_no=?, su_no=?, remark=? 
                  WHERE id=?";
        
        $stmt = $this->conn->prepare($query);
        if (!$stmt) {
            $this->lastError = "Prepare failed: " . $this->conn->error;
            return false;
        }
        
        $stmt->bind_param(
            "ssissssi", 
            $brand_name, 
            $model, 
            $quantity_available, 
            $purchase_date, 
            $serial_no, 
            $su_no, 
            $remark,
            $id_param
        );
        
        if (!$stmt->execute()) {
            $this->lastError = "Execute failed: " . $stmt->error;
            return false;
        }
        
        return true;
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
?>
