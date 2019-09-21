<?php
// Example of TreeGrid using synchronous (submit, non AJAX) communication with server
// Example of simple table
// Uses PHP-TXT-DB database ../Database/TableData.txt as data and XML file DBDef.xml as TreeGrid layout
// Uses routines in TreeGridFramework.php to load and save data
// ! Check if PHP application has write access to Database folder 

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
header("Content-Type: text/html; charset=utf-8"); 
header("Cache-Control: max-age=1; must-revalidate");

// --------------------------------------------------------------------------
// Creates object to use functions from TreeGridFramework.php
$TreeGrid = new TreeGrid(
   $db,                 //Opened database    
   "TableData",         //Table name in database
   "ID",                //Column name in database table where are stored unique row ids
   "",                  //Prefix added in front of id, used if ids are number type
   "",                  //Column name in database table where are stored parent row ids, if is empty, the grid does not contain tree
   ""                   //Column name in database table where are stored Def parameters (predefined values in Layout, used usually in tree
   );

// --------------------------------------------------------------------------
// Saves and loads data using functions in TreeGridFramework.php
$XML = array_key_exists("TGData",$_REQUEST) ? $_REQUEST["TGData"] : "";
if ($XML) $TreeGrid->SaveXMLToDB($XML);                                      // Saves changes
$XML = htmlspecialchars($TreeGrid->LoadXMLFromDB(),ENT_COMPAT);             // Loads data

// --------------------------------------------------------------------------
?>
<html>
   <head>
      <script src="../../../Grid/GridE.js"> </script>
      <style>
         /* Examples shared styles */
         .ExampleHeader { font:normal 16px Arial; color:blue; }
         .ExampleHeader b { color:#800; }
         .ExampleHeader i { color:black; font-style:normal; font-weight:bold; }
         .ExampleHeader u { text-decoration:none; color:#0B0; font-weight:bold; padding:0px 2px 0px 2px; }
         .ExampleName { font:bold 30px Arial; padding:5px 0px 5px 0px; }
         .ExampleShort { font:italic 15px Arial; margin-bottom:10px; padding-top:5px; }
         .ExampleDesc { margin:0px 5px 10px 5px; padding:5px; border:1px solid #AAA; }
         .ExampleErr { margin:50px auto 10px auto; padding:5px; line-height:30px; border:1px solid black; color:red; width:800px; text-align:center; display:none; }
         .ExampleBorder { margin:0px 5px 5px 5px; clear:both; zoom:1; }
         .ExampleDesc ul { padding:0px 0px 0px 15px; margin:10px 0px 0px 0px; }
         .ExampleDesc li { padding-bottom:8px; line-height:18px; }
         .ExampleDesc h4 { display:inline; font:bold 15px Arial; line-height:20px; padding-left:6px; padding-right:6px; background:#87DAE5; border:1px solid #888; color:black; margin:0px; font-style:normal; }
         .ExampleDesc u { text-decoration:none; font-size:11px; }
         .ExampleDesc .Link { text-decoration:underline; color:blue; cursor:pointer; }
         .ExampleForm input { margin:0px 0px 0px 5px; }
      </style>
   </head>
   <body>
      <center class="ExampleHeader"><script>document.write(location.href.replace(/(.*)(\/Examples\/|\/ExamplesGantt\/)([^\/]+)\/([^\/]+)\/([^\/]+)$/,"$2<b>$3</b>/<i>$4</i>/$5").replace(/([^<]|^)(\/|\.)/g,"$1<u>$2</u>"));</script></center>
      <center class="ExampleName">Using TreeGrid PHP framework</center>
      <center class="ExampleShort">Creates grid data from and saves changes back to database using <b>form submit</b> and <b>TreeGrid PHP framework</b></center>
      <div class="ExampleErr">
         <script> if(location.protocol=="file:") document.write("<style>.ExampleDesc, .ExampleBorder {display:none;} .ExampleErr { display:block; } </style>"); </script>
         Do <b>not</b> run this file locally!<br />Run it from your local or remote web http server where is installed PHP.<br>
      </div>
      <div class="ExampleDesc">
         <i>Source files:</i> <h4>Framework.php</h4> (this html page and also server script that generates and processes XML data), 
         <a href="DBDef.xml" target="_blank"><h4>DBDef.xml</h4></a> (static XML layout), 
         <h4>../Database/TableData.txt</h4> (source SQL database table), <h4>../Framework/IncDbTxt.php</h4> (included script for SQL TXT database),
         <h4>../Framework/TreeGridFramework.php</h4> (TreeGrid PHP framework support script, included into <b>Framework.php</b> script)
      </div>
      <div class="ExampleDesc">
         <h4 style="background:#FCC;">The PHP CGI or ISAPI service program must have <b style="color:red;">write access</b> to all files in folder <b style="color:red;">/Examples/Php/Database</b></h4>
      </div>
      <div class="ExampleDesc">
         This example uses <a href="http://www.c-worker.ch/txtdbapi/index_eng.php" target="_blank"><h4>PHP Text DB API</h4></a>, a flat file <b>SQL database</b>.
         The PHP core files for txt database are located in <b>/php-txt-db-api</b> directory. The database is located in directory <b>/Database</b>
            where are stored tables as individual txt files.<br>
         For database access are used objects <b>Database</b> and <b>Recordset</b> defined in <b>/Framework/IncDbTxt.php</b> file.<br /> 
         You can change database provider to other (<h4>MySql</h4>, <h4>ODBC</h4>, <h4>ADO</h4>, <h4>SQLite</h4>, <h4>SQLite3</h4>) by including other <b>IncDb...php</b> file and changing connection string when creating <b>Database</b> object. 
         See comments in Framework.php<br>
      </div>
      <div class="ExampleBorder">
         <div class="ExampleMain" style="width:100%;height:530px;">
            <bdo 
               Layout_Url='DBDef.xml' 
               Data_Tag='TGData' 
               Upload_Tag='TGData' Upload_Format='Internal'
               Export_Url="../Framework/Export.php"
               ></bdo>
         </div>
      </div>
      <form method="post" class="ExampleForm">
         <input id="TGData" name="TGData" type="hidden" value="<?php echo $XML?>">
         <input type="submit" value="Submit changes to server"/>
      </form>

      <!-- Google Analytics code run once for trial -->
      <script>
         var TGTrial = document.cookie.match(/TGTrialPHP\s*=\s*(\d+)/), TGIndex = 256;
         if(!TGTrial||!(TGTrial[1]&TGIndex)) setTimeout(function(){
            var n = "RunTrialPHPFrameworkSubmit", d = (new Date((new Date).getTime()+31536000000)).toUTCString(); document.cookie = "TGTrialPHP="+((TGTrial?TGTrial[1]:0)|TGIndex)+";expires="+d;
            var u = document.cookie.match(/TGTrialUsed\s*=\s*(\d+)/); u = u ? u[1]-0+1 : 1; if(u<=11) document.cookie = "TGTrialUsed="+u+";path=/;expires="+d;
            var s = "<div style='width:0px;height:0px;overflow:hidden;'><iframe src='http"+(document.location.protocol=="https"?"s":"")+"://www.treegrid.com/Stat/GA.html?productName="
                 +(u==1||u==3||u==5||u==10?"UsedTrial"+u:n)+"' onload='var T=this;setTimeout(function(){document.body.removeChild(T.parentNode.parentNode);},1000);'/></div>";
            var F = document.createElement("div"); F.innerHTML = s; document.body.appendChild(F);
            },100);
      </script>

   </body>
</html>