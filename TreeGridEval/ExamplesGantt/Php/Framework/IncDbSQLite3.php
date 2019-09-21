<?php
// -----------------------------------------------------------------------------
// Two objects to access PHP SQLite database; works under any system (Windows, Linux, ...)
// You must have enabled SQLite3 extension to use it under PHP  
// -----------------------------------------------------------------------------
// Recordset created by Database::Execute SQL SELECT command; used to read-only access to returned table
class Recordset {
private $rs, $row;
function Recordset($par) { $this->__construct($par); register_shutdown_function(array($this,"__destruct")); }
function __construct($par){ $this->rs = $par; $this->First(); } // Do not call constructor directly 
function __destruct(){ }
function GetRowCount(){ for($i=0,$this->rs->reset();$this->rs->fetchArray();$i++); return $i; } // Returns number of records, slow !
function GetColCount(){ return $this->rs->numColumns(); } // Returns number columns
function First(){ $this->rs->reset(); return $this->Next(); } // Moves to first record, returns true on success, false on BOF
function Next(){ $this->row = $this->rs->fetchArray(); return !!$this->row; }  // Moves to next record, returns true on success, false on EOF 
function Get($col){ return $this->row[$col]; }  // Returns value of the column value in actual row, column can be column name or index; if column does not exist, returns NULL
function GetRow(){ return $this->row; }  // Returns array of actual row's values 
function GetRows(){ for($i=0,$this->rs->reset();$this->Next();$i++) $arr[$i] = $this->row; return $arr; }                // Returns array of all rows in recordset
}
// -----------------------------------------------------------------------------
// Main object to connect to database; accepts database file name as constructor parameter
class Database {
private $conn;
function Database($file) { $this->__construct($file); register_shutdown_function(array($this,"__destruct")); }
function __construct($file){ $this->conn = new SQLite3($file); }
function __destruct(){ $this->conn->close(); }
function Exec($cmd) { return $this->conn->exec($cmd) ? $this->conn->changes() : NULL; }  // Executes any SQL command other then SELECT; returns number of rows affected
function Query($cmd){ $rs = $this->conn->query($cmd); return $rs ? new Recordset($rs) : NULL; } // Executes SELECT command and returns opened recordset or NULL for other commands
}
// -----------------------------------------------------------------------------
?>