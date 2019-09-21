// -----------------------------------------------------------------------------------------
//                     Support script for TreeGrid MS Excel sheet example
// -----------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------
// Called whenever cell focus is changed
TGSetEvent("OnFocus","Excel",function(G,row,col,orow,ocol,fpos,rect,orect){
if(G.EditMode) {  // There is edited the FOCUS or EDIT cell
   if(G.ECol=="FOCUS") G.EndEdit();// FOCUS cell
   else {                          // EDIT cell
      var oval = G.Edit.Tag.value; // Reads actually entered value in the EDIT cell before the editing ends
      G.IgnoreOnEndEdit = 1;       // Must avoid OnEndEdit, because it sets Focused cell row,col, not the original cell orow,ocol
      G.EndEdit();                 // Cancels editing, the edited value is in oval
      G.IgnoreOnEndEdit = 0;
      orow[ocol] = G.OrigEditValue;// Restores original value in the original focused cell to be the cell marked changed for new value only
      G.SetStringEdit(orow,ocol,oval); // Sets the entered value to originally focused cell
      }
   }
if(!row.Space && (row!=orow||col!=ocol)) CellFocused(row,col);       // Mirrors actually focused cell value to top OUT row, EDIT cell
if(!row.Space){
   var r = G.GetRowById("OUT"); 
   r.FOCUS = row ? G.GetCellName(row,col) + (rect ? " => "+G.GetCellName(rect[0],rect[1])+" : "+G.GetCellName(rect[2],rect[3]) : "") : ""; G.RefreshCell(r,"FOCUS"); // Sets the focused cell to top OUT row, FOCUS cell
   }
});
// -----------------------------------------------------------------------------------------
// Called when grid loses focus
// Here is added only for complete code. Here it is not used, because the example has set StaticCursor.
TGSetEvent("OnBlur","Excel",function(G,orow,ocol,orect){
var G = Grids.Excel;
var r = G.GetRowById("OUT"); 
r.EDIT = ""; 
r.EDITCanEdit = 0;
G.RefreshCell(r,"EDIT");
});
// -----------------------------------------------------------------------------------------
// Called before editing started
TGSetEvent("OnStartEdit","Excel",function(G,row,col){
if(row.id=="OUT" && col=="EDIT") {                          // Editing in top edit
   if(!G.FRow) return true;
   G.OrigEditValue = G.FRow[G.FCol];                        // Saves original displayed value in the edited cell to use if editing is canceled
   }
});
// -----------------------------------------------------------------------------------------
// Called after editing is finished or canceled
TGSetEvent("OnEndEdit","Excel",function(G,row,col,save,val,raw){
if(G.IgnoreOnEndEdit) return;                 // Set in OnFocus on EndEdit call to temporary disable the OnEndEdit
if(row.id=="OUT" && col=="EDIT") {
   G.FRow[G.FCol] = G.OrigEditValue;          // Restores original value in the focused cell to be the cell marked changed for new value only
   if(!save) G.RefreshCell(G.FRow,G.FCol);    // If edit canceled, displays the original value set above
   else G.SetStringEdit(G.FRow,G.FCol,raw);   // After editing top OUT row EDIT mirrors final value including formulas to focused cell
   return "";                                 // Clears the edited value in EDIT, especially to not set EFormula
   }
else if(row.id=="OUT" && col=="FOCUS" && val && save){  // After editing top OUT row FOCUS cell moves focus to the entered cell or range
   val = val.toUpperCase();
   var M = val.match(/\s*([A-Z]+)(\d+)([\s\:\,\.]+([A-Z]+)(\d+))?\s*/);
   if(M) setTimeout(function(){ 
      var r = G.GetRowByIndex(M[2],1); if(!r && M[2]<=1000) for(var i=0;i<100&&!r;i++) { G.AddAutoPages(); r = G.GetRowByIndex(M[2],1,i==99); } // Adds row pages, if the row too far bottom
      var c = G.GetColByIndex(M[1],1); if(!c && M[1].length<=2) for(var i=0;i<100&&!c;i++) { G.AddAutoColPages(); c = G.GetColByIndex(M[1],1,i==99); } // Adds column pages, if the column too far right
      if(M[4]&&M[5]){ // Two cells => focused rectangle
         var r2 = G.GetRowByIndex(M[5],1); if(!r2 && M[5]<=1000) for(var i=0;i<100&&!r2;i++) { G.AddAutoPages(); r2 = G.GetRowByIndex(M[5],1,i==99); } // Adds row pages, if the row too far bottom
         var c2 = G.GetColByIndex(M[4],1); if(!c2 && M[4].length<=2) for(var i=0;i<100&&!c2;i++) { G.AddAutoColPages(); c2 = G.GetColByIndex(M[4],1,i==99); } // Adds column pages, if the column too far right
         G.Focus(r,c,null,[r,c,r2,c2],1); 
         }
      else G.Focus(r,c,null,null,1); // Single cell
      },10);
   }
else if(!save && !row.Space) CellFocused(row,col); // If the edit of table cell was canceled, mirrors old value from focused cell to top OUT row, EDIT cell
});
// -----------------------------------------------------------------------------------------
// Calls CellChanged with value or formula
function CellFocused(row,col){
var G = Grids.Excel;
var val = G.GetStringEdit(row,col).replace(/<\/?\w+[^>]*>/g,"");
CellChanged(val,null);
}
// -----------------------------------------------------------------------------------------
// Mirrors actualy focused cell value to top OUT row 
// Called from OnChange in Edit JSON
function CellChanged(val,old){
var G = Grids.Excel;
var r = G.GetRowById("OUT"); 
r.EDIT = val; 
r.EDITCanEdit = 1;
G.RefreshCell(r,"EDIT");
}
// -----------------------------------------------------------------------------------------
// Mirrors top OUT row cell value to actualy focused cell
// Called from OnChange in Edit JSON
function EditChanged(val,old){
var G = Grids.Excel;
G.FRow[G.FCol] = val; G.RefreshCell(G.FRow,G.FCol);
}
// -----------------------------------------------------------------------------------------
// Called after resized any row by a user
TGSetEvent("OnRowResize","Excel",function(G,row,height,oheight){
if(row.id=="OUT"){ // Resized the OUT row
   if(height<26) height = 26;    // Minimal height of the row is set as 26
   row.MaxHeight = height-13;    // Sets MaxHeight to not resize the EDIT cell due its content. The 13 is top + bottom padding of the cell.
   row.EDITHeight = height-13;   // Sets minimal height of the EDIT cell. The 13 is top + bottom padding of the cell.
   return height;
   }
});
// ------------------------------------------------------------------------------------------------------------
// Called when NoVScroll / NoHScroll is set automatically due small window size, disables the checkbox for manual change of NoVScroll / NoHScroll
// First time it hides resource usage rows. Sets OnceLimit custom attribute to not run it again if a user shows the resource rows again
TGSetEvent("OnLimitScroll","Excel",function(G,clr,noh,nov){ 
G.SetAttribute(G.Rows.Toolbar,"Win","CanEdit",clr,1); 
G.SetAttribute(G.Rows.Toolbar,"Win","Tip",clr?"Disable grid scrollbars and use page scrollbars":"Used page scrollbars because browser window is too small to show this example with its own scrollbars",1); 
document.body.style.margin = clr ? "" : "0px";
G.Rows.Tabber.Space = clr?4:"0";
setTimeout( function(){ G.Render(); },10);
});
// -----------------------------------------------------------------------------------------
