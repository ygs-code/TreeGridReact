<?php
// -----------------------------------------------------------------------------
// Two objects to access database via ODBC; works under any system (Windows, Linux, ...)
// You must create ODBC data source to the database first to use its name as parameter in Database constructor  
// -----------------------------------------------------------------------------
// Recordset created by Database::Execute SQL SELECT command; used to read-only access to the returned table
class Recordset {
private $rs, $cnames, $ccount;
function Recordset($par) { $this->__construct($par); register_shutdown_function(array($this,"__destruct")); }
function __construct($par){ $this->rs = $par; $this->ccount = odbc_num_fields($this->rs); for($i=0;$i<$this->ccount;$i++) $this->cnames[$i] = odbc_field_name($this->rs,$i+1); $this->First(); } // Do not call constructor directly 
function __destruct(){ }
function GetRowCount(){ for($i=0,odbc_fetch_row($this->rs,0);odbc_fetch_row($this->rs);$i++); return $i;  } // Returns number of records, slow !
function GetColCount(){ return $this->ccount; }                                    // Returns number of columns
function First(){ odbc_fetch_row($this->rs,0); return odbc_fetch_row($this->rs); } // Moves to first record, returns true on success, false on BOF
function Next(){ return odbc_fetch_row($this->rs); }                               // Moves to next record, returns true on success, false on EOF 
function Get($col){ return odbc_result($this->rs,is_int($col) ? $col+1 : $col); }    // Returns value of the column value in actual row, column can be column name or index (from 0), if column does not exist, returns NULL
function GetRow(){ foreach($this->cnames as $idx => $name) { $arr[$name] = odbc_result($this->rs,$idx+1); $arr[$idx] = $arr[$name]; } return $arr; } // Returns array of actual row's values as column names and indexes
function GetRows(){ for($i=0,odbc_fetch_row($this->rs,0);odbc_fetch_row($this->rs);$i++) $arr[$i] = $this->GetRow(); return $arr; }                // Returns array of all rows in recordset
}
// -----------------------------------------------------------------------------
// Main object to connect to database, accepts connection string as constructor parameter
class Database {
private $conn;
function Database($connstring) { $this->__construct($connstring); register_shutdown_function(array($this,"__destruct")); }
function __construct($connstring,$user="",$pass=""){ $this->conn = odbc_connect($connstring,$user,$pass); }
function __destruct(){ odbc_close($this->conn); }
function Exec($cmd){ return odbc_exec($this->conn,$cmd); } // Executes any SQL command other then SELECT and returns number of rows affected
function Query($cmd){ $rs = odbc_exec($this->conn,$cmd); return $rs ? new Recordset($rs) : NULL; } // Executes SELECT command and returns opened recordset or NULL for other commands
}
// -----------------------------------------------------------------------------
?>