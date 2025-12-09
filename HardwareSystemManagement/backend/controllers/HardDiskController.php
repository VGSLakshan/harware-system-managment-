<?php
require_once '../models/HardDisk.php';
require_once '../config/db.php';

class HardDiskController {
    private $hardDisk;
    
    public function __construct() {
        // Get database connection
        $database = new Database();
        $db = $database->getConnection();
        
        // Initialize hard disk object
        $this->hardDisk = new HardDisk($db);
    }
    
    // Create hard disk
    public function create($data) {
        // Set hard disk property values
        $this->hardDisk->hard_no = $data->hard_no;
        $this->hardDisk->date = $data->date;
        $this->hardDisk->model = $data->model;
        $this->hardDisk->serial_no = $data->serial_no;
        $this->hardDisk->su_no = $data->su_no ?? '';
        $this->hardDisk->job_no = $data->job_no ?? '';
        $this->hardDisk->section_division = $data->section_division ?? '';
        $this->hardDisk->user = $data->user ?? '';
        $this->hardDisk->remarks = $data->remarks ?? '';
        
        // Create the hard disk
        if($this->hardDisk->create()) {
            return true;
        } else {
            return false;
        }
    }
    
    // Read all hard disks
    public function readAll() {
        // Query hard disks
        $stmt = $this->hardDisk->read();
        
        // Hard disk array
        $hardDisks = [];
        
        // Retrieve results
        while($row = $stmt->fetch_assoc()) {
            $hardDisks[] = $row;
        }
        
        return $hardDisks;
    }
    
    // Read one hard disk
    public function readOne($id) {
        return $this->hardDisk->readOne($id);
    }
    
    // Update hard disk
    public function update($data) {
        // Set ID to update
        $this->hardDisk->id = $data->id;
        
        // Set hard disk property values
        $this->hardDisk->hard_no = $data->hard_no;
        $this->hardDisk->date = $data->date;
        $this->hardDisk->model = $data->model;
        $this->hardDisk->serial_no = $data->serial_no;
        $this->hardDisk->su_no = $data->su_no ?? '';
        $this->hardDisk->job_no = $data->job_no ?? '';
        $this->hardDisk->section_division = $data->section_division ?? '';
        $this->hardDisk->user = $data->user ?? '';
        $this->hardDisk->remarks = $data->remarks ?? '';
        
        // Update the hard disk
        if($this->hardDisk->update()) {
            return true;
        } else {
            return false;
        }
    }
    
    // Delete hard disk
    public function delete($id) {
        // Set hard disk ID to delete
        $this->hardDisk->id = $id;
        
        // Delete the hard disk
        if($this->hardDisk->delete()) {
            return true;
        } else {
            return false;
        }
    }
}
?>
