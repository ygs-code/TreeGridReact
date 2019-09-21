<?php
// -----------------------------------------------------------------------------
// Two objects to access PHP SQLite database; works under any system (Windows, Linux, ...)
// You must enable SQLite extension to use it under PHP  
// -----------------------------------------------------------------------------
// Recordset created by Database::Execute SQL SELECT command; used to read-only access to returned table
class Recordset {
private $rs;
function __construct($par){ $this->rs = $par; $this->First(); } // Do not call constructor directly
function __destruct(){ }
function GetRowCount(){ return sqlite_num_rows ($this->rs); } // Returns number of records, can return -1 if cannot be determined
function GetColCount(){ return sqlite_num_fields($this->rs); } // Returns number columns
function First(){return sql_rewind($this->rs); }   // Moves to first record, returns true on success, false on BOF
function Next(){ return sql_next($this->rs); }     // Moves to next record, returns true on success, false on EOF
function Get($col){ return sqlite_column($this->rs,$col); } // Returns value of the column value in actual row, column can be column name or index; if column does not exist, returns NULL
function GetRow(){ return sqlite_current($this->rs,SQLITE_ASSOC); }  // Returns array of actual row's values 
function GetRows(){ return sqlite_fetch_all($this->rs,SQLITE_ASSOC); }  // return array of rows
}
// -----------------------------------------------------------------------------
// Main object to connect to database; accepts database file name as constructor parameter
class Database {
private $conn;
function __construct($file){ $this->conn = sqlite_open($file); }
function __destruct(){ sqlite_close($this->conn); }
function Exec($cmd){ $err = NULL; if(version_compare(PHP_VERSION,"5.1.0") ? sqlite_exec($this->conn,$cmd) : sqlite_exec($this->conn,$cmd,$err)) return sqlite_changes($this->conn); } // Executes any SQL command other then SELECT; returns number of rows affected
function Query($cmd){ $err = NULL; $rs = version_compare(PHP_VERSION,"5.1.0") ? sqlite_query($this->conn,$cmd,SQLITE_BOTH) : sqlite_query($this->conn,$cmd,SQLITE_BOTH,$err); return $rs ? new Recordset($rs) : NULL; } // Executes SELECT command and returns opened recordset or NULL for other commands
}
// -----------------------------------------------------------------------------
?>