<?php
require_once '../models/RAM.php';
require_once '../config/db.php';

class RAMController {
    private $ram;
    
    public function __construct() {
        // Get database connection
        $database = new Database();
        $db = $database->getConnection();
        
        // Initialize RAM object
        $this->ram = new RAM($db);
    }
    
    // Create RAM
    public function create($data) {
        // Set RAM property values
        $this->ram->brand_name = $data->brand_name;
        $this->ram->model = $data->model;
        $this->ram->quantity_available = $data->quantity_available;
        $this->ram->purchase_date = $data->purchase_date;
        $this->ram->serial_no = $data->serial_no;
        $this->ram->su_no = $data->su_no;
        $this->ram->remark = $data->remark;
        
        // Create the RAM
        if($this->ram->create()) {
            return true;
        } else {
            return false;
        }
    }
    
    // Read all RAMs
    public function readAll() {
        // Query RAMs
        $stmt = $this->ram->read();
        
        // RAM array
        $rams = [];
        
        // Retrieve results
        while($row = $stmt->fetch_assoc()) {
            $rams[] = $row;
        }
        
        return $rams;
    }
    
    // Read one RAM
    public function readOne($id) {
        // Set ID property of RAM to be read
        $this->ram->id = $id;
        
        // Read the RAM details
        if($this->ram->readOne()) {
            // Create array
            $ram = [
                "id" => $this->ram->id,
                "brand_name" => $this->ram->brand_name,
                "model" => $this->ram->model,
                "quantity_available" => $this->ram->quantity_available,
                "purchase_date" => $this->ram->purchase_date,
                "serial_no" => $this->ram->serial_no,
                "su_no" => $this->ram->su_no,
                "remark" => $this->ram->remark
            ];
            
            return $ram;
        } else {
            return null;
        }
    }
    
    // Update RAM
    public function update($data) {
        // Set RAM property values
        $this->ram->id = $data->id;
        $this->ram->brand_name = $data->brand_name;
        $this->ram->model = $data->model;
        $this->ram->quantity_available = $data->quantity_available;
        $this->ram->purchase_date = $data->purchase_date;
        $this->ram->serial_no = $data->serial_no;
        $this->ram->su_no = $data->su_no;
        $this->ram->remark = $data->remark;
        
        // Update the RAM
        if($this->ram->update()) {
            return true;
        } else {
            return false;
        }
    }
    
    // Delete RAM
    public function delete($id) {
        // Set RAM id to be deleted
        $this->ram->id = $id;
        
        // Delete the RAM
        if($this->ram->delete()) {
            return true;
        } else {
            return false;
        }
    }
}
?>