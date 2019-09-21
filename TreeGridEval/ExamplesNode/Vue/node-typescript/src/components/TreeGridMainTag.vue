<!-- TreeGrid main tag that shows the TreeGrid inside -->
<template>
   <div id='TreeGridMainTag'>
      <!-- TreeGrid static definition. Displays the first example on load. By the id value the grid is be accessible for global API like Grids.SampleGrid.Reload(); -->
      <treegrid v-pre='' Debug='check' id='SampleGrid'
         Layout_Url="Layouts/StaticDef.js"
         Data_Url="Layouts/StaticData.js"
         ExportPDF_Url="http://localhost:8000/getpdf" ExportPDF_Type="Cfg,Def,Cols,All"
         ></treegrid>
   </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
   name: 'TreeGridMainTag',
   data: function(){
      return {
         Grid: null as any // Reference to created TreeGrid object
         }
      },
   methods: {
      // Custom method to demonstrate calling Vue method from TreeGrid code
      // Called from TreeGrid json layout, from Action OnRightClickCell, except Sheet example
      // Shows simple custom menu and calls some basic TreeGrid API methods on menu item click
      showCustomMenu : function(row:any,col:any) {
         var G = this.Grid;
         this.Grid!.ShowMenu(row,col,{Items:[
            { Name:row.Deleted?"Undelete row":"Delete row",OnClick:function(){ G!.DeleteRow(row,row.Deleted?3:1); } },
            { Name:row.Selected?"Deselect row":"Select row",OnClick:function(){ G!.SelectRow(row); } },
            { Name:"Copy row",OnClick:function(){ G!.CopyRow(row,null,row,1,0); } },
            { Name:"Add new row",OnClick:function(){ G!.AddRow(null,row,1); } }
            ]});
         return 1;
         }
      },

   created: function () {
      // Handles loading error
      TGSetEvent("OnLoadError","SampleGrid",function(grid:any){ alert("TreeGrid cannot load!\nCheck if the NodeJS server runs on the url http://localhost:8000\nThe sample NodeJS server is located in /ExamplesNode/Server"); });

      // Links TreeGrid and Vue component after TreeGrid loading or reloading with new data when TreeGrid is created by <treegrid> tag
      var Component = this; TGSetEvent("OnInit","SampleGrid",function(grid:any){ grid.Component = Component; Component.Grid = grid; });
      },

   mounted: function(){
      // StartTreeGrid(); // Processes all newly rendered <treegrid> tags on page, uncomment it if the component is not mounted on page load and grid is created by <treegrid> tag
      
      // Uncomment this line to load TreeGrid dynamically from script. If used, remove the <treegrid> tag, the StartTreeGrid() call and the OnInit event that links grid to this class in constructor()
      //this.Grid = TreeGrid({ Debug:'check', id:'SampleGrid', Layout: { Url:"Layouts/StaticDef.js" }, Data: { Url:"Layouts/StaticData.js" }, ExportPDF:{Url:"http://localhost:8000/getpdf", Type:"Cfg,Def,Cols,All"} },"TreeGridMainTag",{ Component:this }); 
      },

   destroyed: function(){
      this.Grid.Dispose();
      }
   });
</script>
