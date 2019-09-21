// --------------------------------------------------------------------------------------------------------------------------
// Supported functions for particular examples
// These scripts are used to run particular examples properly and are not intended to demonstrate using Extended API
// --------------------------------------------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------
// Used if Formula to count unique customers in First.html
function CountUnique(G,Rows,col){
for(var i=0,O={},cnt=0;i<Rows.length;i++) if(Get(Rows[i],"X")){
   var v = Get(Rows[i],col);
   if(!O[v]) { cnt++; O[v] = 1; }
   }
return cnt;
}
// -----------------------------------------------------------------------------------------
// Custom event OnRowSearch for searching in First.xml
// Searches in orders with specified items
function FirstRowSearch(G,row,col,found,F,type){
if(type || G.SearchDefs!="") return found; // Only for "in orders with items" and default call
if(row.Def.Name=="Data") return -1;        // Only for orders
for(var r=row.firstChild;r;r=r.nextSibling) { 
   var found = F(r,col,1);                 // calls F(r,col,type=1)
   if(!(found<=0)) return found; 
   }
return 0;
}
// --------------------------------------------------------------------------------------------------------------------------
// Called on start in First.xml
function FirstUpdated(G){ G.FilterDateRange('D','1/1/2019~1/1/2020','Year',0); G.SetFilter('Month','{5:1,6:1}[(new Date(D)).getMonth()+1]','D',0); }
// --------------------------------------------------------------------------------------------------------------------------
// Helper function for example Books.xml, changes edit mode
function EditChange(edit){
Grids["Books"].Editing = edit ? 1 : 2;
}
// --------------------------------------------------------------------------------------------------------------------------
