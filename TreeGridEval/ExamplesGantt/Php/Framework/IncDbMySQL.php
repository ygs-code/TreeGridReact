<?php
// -----------------------------------------------------------------------------
// Two objects to access database via MySQL; works under any system (Windows, Linux, ...)
// You must create MySQL data source to the database first to use its name as parameter in Database constructor  
// -----------------------------------------------------------------------------
// Recordset created by Database::Execute SQL SELECT command; used to read-only access to returned table
class Recordset {
private $rs, $row;
function Recordset($par) { $this->__construct($par); register_shutdown_function(array($this,"__destruct")); }
function __construct($par){ $this->rs = $par; $this->First(); } // Do not call constructor directly 
function __destruct(){ }
function GetRowCount(){ return mysql_num_rows($this->rs); } // Returns number of records, can return -1 if no rows found
function GetColCount(){ return mysql_num_fields($this->rs); } // Returns number columns
function First(){ $this->row = mysql_data_seek($this->rs,0) ? mysql_fetch_array($this->rs) : NULL; return !!$this->row; } // Moves to first record, returns true on success, false on BOF
function Next(){ $this->row = mysql_fetch_array($this->rs); return !!$this->row; }  // Moves to next record, returns true on success, false on EOF
function Get($col){ return $this->row ? $this->row[$col] : NULL; }  // Returns value of the column value in actual row, column can be column name or index (from 0); if column does not exist, returns NULL
function GetRow(){ return $this->row; }  // Returns array of actual row's values 
function GetRows(){ for($i=0,mysql_data_seek($this->rs,0);$this->Next();$i++) $arr[$i] = $this->row; return $arr; }                // Returns array of all rows in recordset
}
// -----------------------------------------------------------------------------
// Main object to connect to database; accepts database connection string as constructor parameter
class Database {
private $conn;
function Database($connstring) { $cs = explode("|",$connstring); $this->__construct($cs[0],$cs[1],$cs[2],$cs[3]); register_shutdown_function(array($this,"__destruct")); } //ConnectionString is in the form "DBname|[User]|[Password]|[Server[:port]]"
function __construct($name,$user="",$pass="",$server="localhost:3306"){
   $this->conn = mysql_connect($server,$user,$pass) or die("Error while connecting to MySQL server $server: ".mysql_errno()." - ".mysql_error());
   mysql_query("SET NAMES 'utf8'",$this->conn);
   mysql_select_db($name) or die("Error while selecting database $name: ".mysql_errno()." - ".mysql_error());
   }
function __destruct(){ mysql_close($this->conn); }
function Exec($cmd){ mysql_query($cmd,$this->conn); return mysql_affected_rows($this->conn); }  // Executes any SQL command other then SELECT; returns number of rows affected
function Query($cmd){ $rs = mysql_query($cmd,$this->conn); return $rs ? new Recordset($rs) : NULL; }  // Executes SELECT command and returns opened recordset or NULL for other commands
}
// -----------------------------------------------------------------------------
?>