<?php
class Database {
    private $host = "localhost";
    private $db_name = "hardware"; // your DB name
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        $this->conn = new mysqli($this->host, $this->username, $this->password, $this->db_name);
        if ($this->conn->connect_error) {
            die(json_encode(["status"=>"error","message"=>"Database connection failed: " . $this->conn->connect_error]));
        }
        return $this->conn;
    }
}
?>
