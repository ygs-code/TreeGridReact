<?php
// -----------------------------------------------------------------------------
// Two objects to access database via Microsoft ADO.
// Works under Windows only. The ADO (MDAC) must be installed (on Windows XP is by default)
// -----------------------------------------------------------------------------
// Recordset created by Database::Execute SQL SELECT command; used to read-only access to returned table 
class Recordset {
private $rs;
function Recordset($par) { $this->__construct($par); register_shutdown_function(array($this,"__destruct")); }
function __construct($par){ $this->rs = $par; $this->First(); } // Do not call constructor directly
function __destruct(){ if($this->rs && $this->rs->State>0) $this->rs->Close(); }
function GetRowCount(){ return $this->rs->EOF && $this->rs->BOF ? 0 : $this->rs->RecordCount; } // Returns number of records, can return -1 if cannot be determined
function GetColCount(){ return $this->rs->Fields->Count; } // Returns number columns
function First(){$this->rs->MoveFirst(); return !$this->rs->BOF; }    // Moves to first record, returns true on success, false on BOF
function Next(){ $this->rs->MoveNext(); return !$this->rs->EOF; }     // Moves to next record, returns true on success, false on EOF
function Get($col){ return $this->rs->Fields[$col]->Value; }    // Returns value of the column value in actual row, column can be column name or index; if column does not exist, returns NULL
function GetRow(){ $cnt = $this->rs->Fields->Count; for($i=0;$i<$cnt;$i++){ $f = $this->rs->Fields[$i]; $arr[$f->Name] = $f->Value; /*$arr[$i] = $f->Value;*/ } return $arr; }  // Returns array of actual row's values 
function GetRows(){ if($this->rs->EOF && $this->rs->BOF) return NULL; $this->rs->MoveFirst(); for($k=0;!$this->rs->EOF;$k++){ $arr[$k] = $this->GetRow(); $this->rs->MoveNext(); } return $arr; }  // return array of rows
}

// -----------------------------------------------------------------------------
// Main object to connect to database; accepts connection string as constructor parameter, connection specifies all connection's parameters
class Database {
private $conn;
function Database($connstring) { $this->__construct($connstring); register_shutdown_function(array($this,"__destruct")); }
function __construct($connstring){ $this->conn = new COM("ADODB.Connection"); if($this->conn) $this->conn->Open($connstring); } // Creates new database connection from connection string
function __destruct(){ if($this->conn) $this->conn->Close(); }
function Exec($Command){ $rows = 0; $rs = $this->conn->Execute($Command,$rows); return $rows; }  // Executes any SQL command other then SELECT; returns number of rows affected
function Query($Command){ $rs = $this->conn->Execute($Command); return $rs->State!=0 ? new Recordset($rs) : NULL; } // Executes SELECT command and returns opened recordset or NULL for other commands
}
// -----------------------------------------------------------------------------
?>