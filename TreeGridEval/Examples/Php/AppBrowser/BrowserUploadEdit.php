<?php
// --------------------------------------------------------------------------
  
// --- Response initialization ---
$Base = dirname(__FILE__) . "/TestFiles/";

// --- Save data to disk ---
$File = array_key_exists("File",$_REQUEST) ? $_REQUEST["File"] : "";
$Data = array_key_exists("Data",$_REQUEST) ? $_REQUEST["Data"] : ""; if ($Data == null) $Data = "";

$handle = fopen($Base . $File,"w"); 
fwrite($handle,str_replace("&amp;","&",str_replace("&gt;",">",str_replace("&lt;","<",$Data)))); 
fclose($handle);             

echo("OK");

// --------------------------------------------------------------------------
?>