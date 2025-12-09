<?php
class HardDisk {
    // Database connection and table name
    private $conn;
    private $table_name = "hard_disk";
    
    // Object properties
    public $id;
    public $hard_no;
    public $date;
    public $model;
    public $serial_no;
    public $su_no;
    public $job_no;
    public $section_division;
    public $user;
    public $remarks;
    public $created_at;
    
    // Constructor with DB connection
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Create hard disk
    public function create() {
        // Query to insert record
        $query = "INSERT INTO " . $this->table_name . " 
                  (hard_no, date, model, serial_no, su_no, job_no, section_division, user, remarks) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        // Prepare query
        $stmt = $this->conn->prepare($query);
        
        // Sanitize
        $this->hard_no = htmlspecialchars(strip_tags($this->hard_no));
        $this->date = htmlspecialchars(strip_tags($this->date));
        $this->model = htmlspecialchars(strip_tags($this->model));
        $this->serial_no = htmlspecialchars(strip_tags($this->serial_no));
        $this->su_no = htmlspecialchars(strip_tags($this->su_no));
        $this->job_no = htmlspecialchars(strip_tags($this->job_no));
        $this->section_division = htmlspecialchars(strip_tags($this->section_division));
        $this->user = htmlspecialchars(strip_tags($this->user));
        $this->remarks = htmlspecialchars(strip_tags($this->remarks));
        
        // Bind parameters
        $stmt->bind_param("sssssssss", 
            $this->hard_no, 
            $this->date, 
            $this->model, 
            $this->serial_no, 
            $this->su_no, 
            $this->job_no, 
            $this->section_division, 
            $this->user, 
            $this->remarks
        );
        
        // Execute query
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    // Read all hard disks
    public function read() {
        // Query
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY id DESC";
        
        // Prepare and execute
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt->get_result();
    }
    
    // Read one hard disk
    public function readOne($id) {
        // Query
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Bind parameter
        $stmt->bind_param("i", $id);
        
        // Execute query
        $stmt->execute();
        
        // Get result
        $result = $stmt->get_result();
        
        // Fetch record
        if($row = $result->fetch_assoc()) {
            return $row;
        }
        
        return null;
    }
    
    // Update hard disk
    public function update() {
        // Query
        $query = "UPDATE " . $this->table_name . " 
                  SET hard_no = ?, date = ?, model = ?, serial_no = ?, 
                      su_no = ?, job_no = ?, section_division = ?, user = ?, remarks = ? 
                  WHERE id = ?";
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Sanitize
        $this->hard_no = htmlspecialchars(strip_tags($this->hard_no));
        $this->date = htmlspecialchars(strip_tags($this->date));
        $this->model = htmlspecialchars(strip_tags($this->model));
        $this->serial_no = htmlspecialchars(strip_tags($this->serial_no));
        $this->su_no = htmlspecialchars(strip_tags($this->su_no));
        $this->job_no = htmlspecialchars(strip_tags($this->job_no));
        $this->section_division = htmlspecialchars(strip_tags($this->section_division));
        $this->user = htmlspecialchars(strip_tags($this->user));
        $this->remarks = htmlspecialchars(strip_tags($this->remarks));
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Bind parameters
        $stmt->bind_param("sssssssssi", 
            $this->hard_no, 
            $this->date, 
            $this->model, 
            $this->serial_no, 
            $this->su_no, 
            $this->job_no, 
            $this->section_division, 
            $this->user, 
            $this->remarks, 
            $this->id
        );
        
        // Execute query
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    // Delete hard disk
    public function delete() {
        // Query
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Bind parameter
        $stmt->bind_param("i", $this->id);
        
        // Execute query
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
}
?>
