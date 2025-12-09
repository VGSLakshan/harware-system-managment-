<?php
class RAM {
    // Database connection and table name
    private $conn;
    private $table_name = "ram";
    
    // Object properties
    public $id;
    public $brand_name;
    public $model;
    public $quantity_available;
    public $purchase_date;
    public $serial_no;
    public $su_no;
    public $remark;
    
    // Constructor with DB connection
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Create RAM
    public function create() {
        // Query to insert record
        $query = "INSERT INTO " . $this->table_name . " 
                  (brand_name, model, quantity_available, purchase_date, serial_no, su_no, remark) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        // Prepare query
        $stmt = $this->conn->prepare($query);
        
        // Sanitize
        $this->brand_name = htmlspecialchars(strip_tags($this->brand_name));
        $this->model = htmlspecialchars(strip_tags($this->model));
        $this->quantity_available = htmlspecialchars(strip_tags($this->quantity_available));
        $this->purchase_date = htmlspecialchars(strip_tags($this->purchase_date));
        $this->serial_no = htmlspecialchars(strip_tags($this->serial_no));
        $this->su_no = htmlspecialchars(strip_tags($this->su_no));
        $this->remark = htmlspecialchars(strip_tags($this->remark));
        
        // Bind values
        $stmt->bind_param(
            "ssissss", 
            $this->brand_name, 
            $this->model, 
            $this->quantity_available, 
            $this->purchase_date, 
            $this->serial_no, 
            $this->su_no, 
            $this->remark
        );
        
        // Execute query
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    // Read all RAMs
    public function read() {
        // Query to select all
        $query = "SELECT * FROM " . $this->table_name;
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Execute query
        $stmt->execute();
        
        return $stmt->get_result();
    }
    
    // Read one RAM
    public function readOne() {
        // Query to read single record
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Bind ID
        $stmt->bind_param("i", $this->id);
        
        // Execute query
        $stmt->execute();
        
        // Get result
        $result = $stmt->get_result();
        
        if($result->num_rows > 0) {
            // Fetch row
            $row = $result->fetch_assoc();
            
            // Set values to object properties
            $this->id = $row['id'];
            $this->brand_name = $row['brand_name'];
            $this->model = $row['model'];
            $this->quantity_available = $row['quantity_available'];
            $this->purchase_date = $row['purchase_date'];
            $this->serial_no = $row['serial_no'];
            $this->su_no = $row['su_no'];
            $this->remark = $row['remark'];
            
            return true;
        }
        
        return false;
    }
    
    // Update RAM
    public function update() {
        // Update query
        $query = "UPDATE " . $this->table_name . " 
                  SET 
                    brand_name = ?, 
                    model = ?, 
                    quantity_available = ?, 
                    purchase_date = ?, 
                    serial_no = ?, 
                    su_no = ?, 
                    remark = ? 
                  WHERE id = ?";
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Sanitize
        $this->brand_name = htmlspecialchars(strip_tags($this->brand_name));
        $this->model = htmlspecialchars(strip_tags($this->model));
        $this->quantity_available = htmlspecialchars(strip_tags($this->quantity_available));
        $this->purchase_date = htmlspecialchars(strip_tags($this->purchase_date));
        $this->serial_no = htmlspecialchars(strip_tags($this->serial_no));
        $this->su_no = htmlspecialchars(strip_tags($this->su_no));
        $this->remark = htmlspecialchars(strip_tags($this->remark));
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Bind parameters
        $stmt->bind_param(
            "ssissssi", 
            $this->brand_name, 
            $this->model, 
            $this->quantity_available, 
            $this->purchase_date, 
            $this->serial_no, 
            $this->su_no, 
            $this->remark, 
            $this->id
        );
        
        // Execute query
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    // Delete RAM
    public function delete() {
        // Delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Bind id
        $stmt->bind_param("i", $this->id);
        
        // Execute query
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
}
?>