<?php
// -----------------------------------------------------------------------------
// Two objects to access database via txt-db-api; works under any system (Windows, Linux, ...) and PHP
// Uses text files in /Database dir
// -----------------------------------------------------------------------------
require_once("../php-txt-db-api/txt-db-api.php");
// -----------------------------------------------------------------------------
// Recordset created by Database::Execute SQL SELECT command; used to read-only access to returned table
class Recordset {
private $rs, $rcount, $cnames;
function Recordset($par) { $this->__construct($par); register_shutdown_function(array($this,"__destruct")); }
function __construct($par){ $this->rs = $par; $this->rcount = $this->rs->getRowCount(); $this->cnames = $this->rs->getColumnNames(); $this->First(); }  // Do not call constructor directly 
function __destruct(){ }
function GetRowCount(){ return $this->rcount; } // Returns number of records, can return -1 if cannot be determined
function GetColCount(){ return $this->rs->getRowSize(); } // Returns number columns
function First(){ if(!$this->rcount) return NULL; $this->rs->setPos(0); return true; } // Moves to first record, returns true on success, false on BOF
function Next(){ return $this->rs->next(); }  // Moves to next record, returns true on success, false on EOF 
function Get($col){ $val = is_int($col) ? $this->rs->getCurrentValueByNr($col) : $this->rs->getCurrentValueByName($col); return strtolower($val)=="null" ? NULL : $val; }  // Returns value of the column value in actual row, column can be column name or index (from 0); if column does not exist, returns NULL
function GetRow(){ $A = $this->rs->getCurrentValues(); foreach($this->cnames as $idx => $name) { $arr[$name] = strtolower($A[$idx])=="null" ? NULL : $A[$idx]; /*$arr[$idx] = $arr[$name];*/ } return $arr; } // Returns array of actual row's values 
function GetRows(){ if($this->First()) { $k = 0; do { $arr[$k++] = $this->GetRow(); } while($this->Next()); return $arr; } }  // Returns array of all rows in recordset
}
// -----------------------------------------------------------------------------
// Main object to connect to database; accepts database file name as constructor parameter
class Database {
private $conn;
function Database($connstring) { $this->__construct($connstring); register_shutdown_function(array($this,"__destruct")); }
function __construct($connstring){ $this->conn = new TxtDatabase($connstring); }
function __destruct(){ }
function Exec($cmd){ return $this->conn->executeQuery($cmd); }  // Executes any SQL command other then SELECT; returns number of rows affected
function Query($cmd){ $rs = $this->conn->executeQuery($cmd); return $rs ? new Recordset($rs) : NULL; } // Executes SELECT command and returns opened recordset or NULL for other commands
}
// -----------------------------------------------------------------------------
?>