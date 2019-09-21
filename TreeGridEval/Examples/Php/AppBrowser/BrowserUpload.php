<?php

// --- response initialization ---
$Base = dirname(__FILE__) . "/TestFiles/";
header("Content-Type: text/xml; charset=utf-8"); 
header("Cache-Control: max-age=1; must-revalidate");

// --- Save data to disk ---                            
$XML = array_key_exists("Data",$_REQUEST) ? $_REQUEST["Data"] : "";
          
if ($XML) {
  if(get_magic_quotes_gpc()) $XML = stripslashes($XML);

  // --- simple xml or php xml --- 
  $SXML = is_callable("simplexml_load_string");
  if(!$SXML) require_once("../Framework/Xml.php");  
  if($SXML){ 
    $Xml = simplexml_load_string(html_entity_decode($XML));
    $AI = $Xml->Changes->I;
    }
  else { 
    $Xml = CreateXmlFromString(html_entity_decode($XML));
    $AI = $Xml->getElementsByTagName($Xml->documentElement,"I");
    }
  
  foreach($AI as $I){
    $A = $SXML ? $I->attributes() : $Xml->attributes[$I];
    // --- end of simple xml or php xml --- 

    $id = $A["id"];        
    $ids = explode('$',($A[$id] != null ? $A[$id] : $id));                
    $Path = $ids[0] . "/" . $ids[2] . "." . $ids[1];
    $Clear = false;

    if (!empty($A["Deleted"])) {
      unlink($Base . $Path);      
      $A[$id] = null;
      $Clear = true;
      }

    else {
      $Names = array("P","E","N");
      for ($j = 0; $j < 3; $j++) if ($A[$Names[$j]]) {$ids[$j] = $A[$Names[$j]];}      
      $New = $ids[0] . "/" . $ids[2] . "." . $ids[1];   

      if ($New != $Path || !empty($A["Added"])) {
        $A[$id] = $ids[0] . "$" . $ids[1] . "$" . $ids[2]; // Changes the id path for next use                
        $dir = substr($New,0,strrpos($New,'/')); 
        if (!file_exists($Base . $dir)) {mkdir($Base . $dir,0777);} // Creates directories if required          
        }        
        
      if (!empty($A["Copy"])) {          
        if ($A["Copy"] != null) $Copy = $A["Copy"];
        $cids = explode('$',$Copy);                   
        $cpath = $cids[0] . "/" . $cids[2] . "." . $cids[1];
        copy($Base . $cpath,$Base . $New); 
        }        
      elseif (file_exists($Base . $Path)) { rename($Base . $Path,$Base . $New); $Clear = true; } // Move or rename        
      else { $handle = fopen("TestFiles/" . $New,"w"); fclose($handle); } // New
      }

    if ($Clear) { // Deletes empty directories
      $idx = strrpos($Path,'/');     
      while($idx>=0){
        $Path = substr($Path,0,$idx);
        if (count(scandir($Base . $Path)) > 0) break;          
        rmdir($Base . $Path);
        $idx = strrpos($Path,'/');          
        }
      }
    }
  }
echo "<Grid><IO Result='0'/></Grid>";

?>