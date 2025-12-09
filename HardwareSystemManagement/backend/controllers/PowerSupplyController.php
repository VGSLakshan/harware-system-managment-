<?php
require_once '../models/PowerSupply.php';
require_once '../config/db.php';

class PowerSupplyController {
    private $powerSupply;
    
    public function __construct() {
        // Get database connection
        $database = new Database();
        $db = $database->getConnection();
        
        // Initialize power supply object
        $this->powerSupply = new PowerSupply($db);
    }
    
    // Create power supply
    public function create($data) {
        // Set power supply property values
        $this->powerSupply->power_supply_no = $data->power_supply_no;
        $this->powerSupply->date = $data->date;
        $this->powerSupply->model = $data->model;
        $this->powerSupply->serial_no = $data->serial_no;
        $this->powerSupply->su_no = $data->su_no ?? '';
        $this->powerSupply->job_no = $data->job_no ?? '';
        $this->powerSupply->division = $data->division ?? '';
        $this->powerSupply->remarks = $data->remarks ?? '';
        
        // Create the power supply
        if($this->powerSupply->create()) {
            return true;
        } else {
            return false;
        }
    }
    
    // Read all power supplies
    public function readAll() {
        // Query power supplies
        $stmt = $this->powerSupply->read();
        
        // Power supply array
        $powerSupplies = [];
        
        // Retrieve results
        while($row = $stmt->fetch_assoc()) {
            $powerSupplies[] = $row;
        }
        
        return $powerSupplies;
    }
    
    // Read one power supply
    public function readOne($id) {
        // Set ID property of power supply to be read
        $this->powerSupply->id = $id;
        
        // Read the power supply details
        if($this->powerSupply->readOne()) {
            // Create array
            $powerSupply = [
                "id" => $this->powerSupply->id,
                "power_supply_no" => $this->powerSupply->power_supply_no,
                "date" => $this->powerSupply->date,
                "model" => $this->powerSupply->model,
                "serial_no" => $this->powerSupply->serial_no,
                "su_no" => $this->powerSupply->su_no,
                "job_no" => $this->powerSupply->job_no,
                "division" => $this->powerSupply->division,
                "remarks" => $this->powerSupply->remarks
            ];
            
            return $powerSupply;
        } else {
            return null;
        }
    }
    
    // Update power supply
    public function update($data) {
        // Set power supply property values
        $this->powerSupply->id = $data->id;
        $this->powerSupply->power_supply_no = $data->power_supply_no;
        $this->powerSupply->date = $data->date;
        $this->powerSupply->model = $data->model;
        $this->powerSupply->serial_no = $data->serial_no;
        $this->powerSupply->su_no = $data->su_no ?? '';
        $this->powerSupply->job_no = $data->job_no ?? '';
        $this->powerSupply->division = $data->division ?? '';
        $this->powerSupply->remarks = $data->remarks ?? '';
        
        // Update the power supply
        if($this->powerSupply->update()) {
            return true;
        } else {
            return false;
        }
    }
    
    // Delete power supply
    public function delete($id) {
        // Set power supply id to be deleted
        $this->powerSupply->id = $id;
        
        // Delete the power supply
        if($this->powerSupply->delete()) {
            return true;
        } else {
            return false;
        }
    }
}
?>