<?php
class PowerSupply {
    // Database connection and table name
    private $conn;
    private $table_name = "power_supply";
    
    // Object properties
    public $id;
    public $power_supply_no;
    public $date;
    public $model;
    public $serial_no;
    public $su_no;
    public $job_no;
    public $division;
    public $remarks;
    
    // Constructor with DB connection
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Create power supply
    public function create() {
        // Query to insert record
        $query = "INSERT INTO " . $this->table_name . " 
                  (power_supply_no, date, model, serial_no, su_no, job_no, division, remarks) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        // Prepare query
        $stmt = $this->conn->prepare($query);
        
        // Sanitize
        $this->power_supply_no = htmlspecialchars(strip_tags($this->power_supply_no));
        $this->date = htmlspecialchars(strip_tags($this->date));
        $this->model = htmlspecialchars(strip_tags($this->model));
        $this->serial_no = htmlspecialchars(strip_tags($this->serial_no));
        $this->su_no = htmlspecialchars(strip_tags($this->su_no));
        $this->job_no = htmlspecialchars(strip_tags($this->job_no));
        $this->division = htmlspecialchars(strip_tags($this->division));
        $this->remarks = htmlspecialchars(strip_tags($this->remarks));
        
        // Bind values
        $stmt->bind_param(
            "ssssssss", 
            $this->power_supply_no, 
            $this->date, 
            $this->model, 
            $this->serial_no, 
            $this->su_no, 
            $this->job_no, 
            $this->division,
            $this->remarks
        );
        
        // Execute query
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    // Read all power supplies
    public function read() {
        // Query to select all
        $query = "SELECT * FROM " . $this->table_name;
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Execute query
        $stmt->execute();
        
        return $stmt->get_result();
    }
    
    // Read one power supply
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
            $this->power_supply_no = $row['power_supply_no'];
            $this->date = $row['date'];
            $this->model = $row['model'];
            $this->serial_no = $row['serial_no'];
            $this->su_no = $row['su_no'];
            $this->job_no = $row['job_no'];
            $this->division = $row['division'];
            $this->remarks = $row['remarks'];
            
            return true;
        }
        
        return false;
    }
    
    // Update power supply
    public function update() {
        // Update query
        $query = "UPDATE " . $this->table_name . " 
                  SET 
                    power_supply_no = ?, 
                    date = ?, 
                    model = ?, 
                    serial_no = ?, 
                    su_no = ?, 
                    job_no = ?, 
                    division = ?, 
                    remarks = ? 
                  WHERE id = ?";
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Sanitize
        $this->power_supply_no = htmlspecialchars(strip_tags($this->power_supply_no));
        $this->date = htmlspecialchars(strip_tags($this->date));
        $this->model = htmlspecialchars(strip_tags($this->model));
        $this->serial_no = htmlspecialchars(strip_tags($this->serial_no));
        $this->su_no = htmlspecialchars(strip_tags($this->su_no));
        $this->job_no = htmlspecialchars(strip_tags($this->job_no));
        $this->division = htmlspecialchars(strip_tags($this->division));
        $this->remarks = htmlspecialchars(strip_tags($this->remarks));
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Bind parameters
        $stmt->bind_param(
            "ssssssssi", 
            $this->power_supply_no, 
            $this->date, 
            $this->model, 
            $this->serial_no, 
            $this->su_no, 
            $this->job_no, 
            $this->division,
            $this->remarks,
            $this->id
        );
        
        // Execute query
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    // Delete power supply
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