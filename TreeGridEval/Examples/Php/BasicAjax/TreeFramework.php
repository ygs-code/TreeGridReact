<?php
// ! Support file only, run TreeFramework.html instead !
// This file is used as both Data_Url and Upload_Url
// Generates data for TreeGrid when no data received or saves received changes to database
// Uses routines in TreeGridFramework.php to load and save data 

// --- Database switching ---

// Uses PHP-TXT-DB-API textual database; uses database in directory ../Database
define("API_HOME_DIR" ,"../php-txt-db-api/"); // Sets path to PHP TXT DB database script 
require_once("../Framework/IncDbTxt.php"); $db = new Database("../Database");

// Uncomment this line to use SQLite3 database; uses database in file ../Database.db
//require_once("../Framework/IncDbSQLite3.php"); $db = new Database("../Database.db");

// Uncomment this line to use MS Access database via ODBC; uses database in file ../Database.mdb
//require_once("../Framework/IncDbOdbc.php"); $db = new Database("DRIVER={Microsoft Access Driver (*.mdb)}; DBQ=".dirname(__FILE__)."/../Database.mdb");
// Note, for some ODBC drivers you may need to convert all strings from / to UTF8 encoding like: mb_convert_encoding($string,'UTF-8','Windows-1252');

// Uncomment this line to use MS Access database via MS ADO; uses database in file ../Database.mdb
//require_once("../Framework/IncDbAdo.php"); $db = new Database("DRIVER={Microsoft Access Driver (*.mdb)}; DBQ=".dirname(__FILE__)."/../Database.mdb");

// Uncomment this line to use MySQL database; it uses database table created by provided MySqlUTF8.sql script
//require_once("../Framework/IncDbMySQL.php"); $db = new Database("TreeGridTest","root","your root password");
// Before use, run the /Examples/Php/MySqlUTF8.sql script in your MySql database engine. 
// MySQL must be in UTF8 encoding to store the characters correctly!
// The SQL script can be run on database by: mysql.exe -uroot -p < MySqlUTF8.sql. 
// Update paths or copy MySqlUTF8.sql to the MySQL /bin directory and run it here.

require_once("../Framework/TreeGridFramework.php");  
header("Content-Type: text/xml; charset=utf-8"); 
header("Cache-Control: max-age=1; must-revalidate");

// --------------------------------------------------------------------------
// Creates object to use functions from TreeGridFramework.php
$TreeGrid = new TreeGrid(
   $db,                 //Opened database
   "TreeData",          //Table name in database
   "id",                //Column name in database table where are stored unique row ids
   "",                  //Prefix added in front of id, used if ids are number type
   "Parent",            //Column name in database table where are stored parent row ids, if is empty, the grid does not contain tree
   "Def"                //Column name in database table where are stored Def parameters (predefined values in Layout, used usually in tree
   );

// --------------------------------------------------------------------------
// Saves and loads data using functions in TreeGridFramework.php
$XML = array_key_exists("TGData",$_REQUEST) ? $_REQUEST["TGData"] : "";
if ($XML){                                                // Saves changes
   $TreeGrid->SaveXMLToDB($XML);
   echo "<Grid><IO Result='0'/></Grid>";                          
   } 
else echo $TreeGrid->LoadXMLFromDB();                     // Loads data

// --------------------------------------------------------------------------
?>