<?php  
// -------------------------------------------------------------------------------------------------------------------------------
// Application that prints TreeGrid and exports it to PDF
// It uses Google Chrome Headless as command line tool
// -------------------------------------------------------------------------------------------------------------------------------


// !!! Set here the path of your Google Chrome or Chromium executable !!!
$ChromeWin = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\Chrome.exe";
$ChromeLinux = "google-chrome";
$ChromeMac = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
$Chrome = PHP_OS=="WINNT" ? $ChromeWin : (PHP_OS=="Darwin" ? $ChromeMac : $ChromeLinux);
$Error = "set correct path to your Chrome executable in /ExamplesPDF/Php/ExportPdf.php<br><br>If you don't have it installed on your server, you can download Chrome from <a href='https://www.google.com/chrome/'>https://www.google.com/chrome/</a> or Chromium from <a href='http://www.chromium.org/getting-involved/download-chromium'>http://www.chromium.org/getting-involved/download-chromium</a><br><br>If you cannot install Chrome on your server, download and use our <a href='http://www.treegrid.com/Download#PDF'>ExportPDF package with third party converters</a>";
if((PHP_OS=="WINNT"||PHP_OS=="Darwin")&&!file_exists($Chrome)){ echo("<h3>PDF export error!</h3>Please $Error"); return; }

$TempPath = sys_get_temp_dir();          // !!! Set temp directory here if the default temp is not accessible for PHP to write !!!
$Temp = ""; while($Temp==""||file_exists($Temp)) $Temp = "$TempPath/TreeGrid" . rand();
if(!mkdir($Temp)){ echo("<h3>PDF export error!</h3>Cannot write to '$Temp'. Please set correct path to temp directory where PHP has write permissions in /ExamplesPDF/Php/ExportPdf.php"); return; }
function rrmdir($dir) { foreach(glob($dir.'/*') as $f) if(is_dir($f)) rrmdir($f); else unlink($f); rmdir($dir); } // Function to delete not empty directory
$Url = "http://" . $_SERVER['SERVER_NAME'] . ":" . $_SERVER['SERVER_PORT'] . dirname($_SERVER['PHP_SELF']) . "/";
$Source = array_key_exists("Source",$_REQUEST) ? $_REQUEST["Source"] : "";
if($Source=="") { echo "<h3>PDF export error!</h3>No source file for print"; rrmdir($Temp); return; }

// --- Writes configuration received from client ---
$Path = dirname(__FILE__) . "/";
$XML = array_key_exists("Data",$_REQUEST) ? $_REQUEST["Data"] : "";
if(get_magic_quotes_gpc()) $XML = stripslashes($XML);
$Cfg = ""; while($Cfg==""||file_exists($Cfg)) $Cfg = "Tmp" . rand() . ".xml";            // Temporary file name to store XML configuration
if(!file_put_contents("$Path$Cfg",$XML)) { echo("<h3>PDF export error!</h3>Cannot write to $Path$Cfg"); rrmdir($Temp); return; } // Saves the XML configuration to use it by the html page that prints the PDF

// --- Reads options ---
$PageWidth = array_key_exists("PrintPageWidth",$_REQUEST) ? $_REQUEST["PrintPageWidth"] : "0";    
$PageHeight = array_key_exists("PrintPageHeight",$_REQUEST) ? $_REQUEST["PrintPageHeight"] : "0"; 
$MarginWidth = array_key_exists("PrintMarginWidth",$_REQUEST) ? $_REQUEST["PrintMarginWidth"] : "0";    
$MarginHeight = array_key_exists("PrintMarginHeight",$_REQUEST) ? $_REQUEST["PrintMarginHeight"] : "0"; 
$DPI = array_key_exists("PrintDPI",$_REQUEST) ? $_REQUEST["PrintDPI"] : ""; 
$FitPage = array_key_exists("PDFFitPage",$_REQUEST) ? $_REQUEST["PDFFitPage"] : ""; 
                                                                                                                       
// --- Creates the PDF ---
$exe = "\"$Chrome\" --headless --disable-gpu --user-data-dir=\"$Temp\" --print-to-pdf=\"$Temp/Out.pdf\" \"$Url$Source?$Url$Cfg&$DPI&$PageWidth&$PageHeight&$MarginWidth&$MarginHeight&$FitPage\""; $ret = -1; 
$ret = exec_async($exe,120,"$Temp/Out.pdf"); // Runs Chrome asynchronously until the file is created or 2 minutes ellapse. Increase the time if exporting very large files. !!! Remove this line if causes problems
if($ret==-1) exec($exe, $out, $ret); // Synchronous running if asynchronous start failed. !!! If $ret is not zero, you can try also to add parameters like: --no-sandbox --enable-logging
if($ret!=0 || !file_exists("$Temp/Out.pdf")){ echo "<h3>PDF export error!</h3>Chrome failed with exit code: $ret<br>It requires in <b>php.ini</b> \"<b>safe_mode off</b>\" and the <b>exec</b> functions must <u>not</u> be in '<b>disable_functions</b>' directive<br>Also you need to $Error"; unlink("$Path$Cfg"); rrmdir($Temp); return; }
$Pdf = file_get_contents("$Temp/Out.pdf"); // Reads the PDF file into memory
try {
   unlink("$Path$Cfg");                       // Deletes the temporary file with configuration
   rrmdir($Temp);                             // Deletes the whole temporary directory
   }
catch(Exception $e) { }

// --- response initialization ---
header("Content-Type: application/pdf; charset=utf-8"); 
header("Cache-Control: max-age=1; must-revalidate");
$name = array_key_exists("PDFName",$_REQUEST) ? $_REQUEST["PDFName"] : (array_key_exists("File",$_REQUEST) ? $_REQUEST["File"] : "Export");
$ext = array_key_exists("PDFFormat",$_REQUEST) ? $_REQUEST["PDFFormat"] : "pdf"; 
header("Content-Disposition: attachment; filename=\"$name.$ext\"");
echo $Pdf;


// --- Functions for asynchronous process running ---
// exec_async runs the command $cmd and waits maximally $wait second for its finish. After $wait is ellapsed, kills the process. It finshes also if $file is created by the process
function exec_async($cmd,$wait,$file){
$pid = run_process($cmd); if(!$pid) return -1;
for($i=0;$i<$wait*2;$i++){ // Waits maximally two minutes, increase if exporting very large files
   sleep(0.5);
   if(!is_process_running($pid)) return file_exists($file) ? 0 : -2;
   if(file_exists($file)){ // Checks if the file already exists, because Chrome sometimes creates successfully the file, but hangs after that
      $f = fopen($file,'a');
      if($f){
         fclose($f);
         stop_process($pid,10);
         return 0;
         }
      }
   }
stop_process($pid,10);
return file_exists($file) ? 0 : -2;
}

function run_process($cmd,$outputFile = '/dev/null', $append = false){
$pid = 0;
if(strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') { // Windows
   $handle = popen("start /B wmic process call create '" . $cmd . "' | find \"ProcessId\"", "r");
   $read = fread($handle, 200); //Read the output 
   $pid = substr($read,strpos($read,'=')+1); $pid = substr($pid,0,strpos($pid,';') ); $pid = (int)$pid;
   pclose($handle); //Close
   }
else $pid = (int)shell_exec(sprintf('%s %s %s 2>&1 & echo $!', $cmd, ($append) ? '>>' : '>', $outputFile)); // Linux
return $pid;
}

function is_process_running($pid){
if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {  // Windows
   $result = shell_exec('tasklist /FI "PID eq '.$pid.'"' ); 
   return count(preg_split("/\n/", $result)) > 0 && !preg_match('/No tasks/', $result); 
   }
else{ // Linux
   $result = shell_exec(sprintf('ps %d 2>&1', $pid));
   return count(preg_split("/\n/", $result)) > 2 && !preg_match('/ERROR: Process ID out of range/', $result);
   }
}

function stop_process($pid,$wait){
if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') { // Windows
   $result = shell_exec('wmic process where "ProcessId='.$pid.'" call terminate');
   if (count(preg_split("/\n/", $result)) < 0 || preg_match('/No instances/', $result)) return false;
   }
else{ // Linux
   $result = shell_exec(sprintf('kill %d 2>&1', $pid));
   if (preg_match('/No such process/', $result)) return false;
   }
if($wait) for($i=0;$i<$wait*2;$i++) {
   if(!is_process_running($pid)) return true;
   sleep(0.5);
   }
return true;
}

?>