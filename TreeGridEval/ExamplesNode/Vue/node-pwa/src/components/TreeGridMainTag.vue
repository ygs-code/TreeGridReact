<!-- TreeGrid main tag that shows the TreeGrid inside -->
<template>
   <div id='TreeGridMainTag'>
      <!-- TreeGrid static definition. Displays the first example on load. By the id value the grid is be accessible for global API like Grids.SampleGrid.Reload(); -->
      <!-- Uncomment it to use TreeGrid static definition. And also remove the TreeGrid() call in the mounted function that creates TreeGrid dynamically
      <treegrid v-pre Debug='check' id='SampleGrid'
         Layout_Url="static/Layouts/StaticDef.js" 
         Data_Url="static/Layouts/StaticData.js"
         ExportPDF_Url="http://localhost:8000/getpdf" ExportPDF_Type="Cfg,Def,Cols,All"
         ></treegrid>
      -->
   </div>
</template>

<script>
export default {
   name: 'TreeGridMainTag',
   data: function(){
      return {
         Grid: null // Reference to created TreeGrid object
         }
      },
   methods: {
      // Custom method to demonstrate calling Vue method from TreeGrid code
      // Called from TreeGrid json layout, from Action OnRightClickCell, except Sheet example
      // Shows simple custom menu and calls some basic TreeGrid API methods on menu item click
      showCustomMenu : function(row,col) {
         var G = this.Grid;
         this.Grid.ShowMenu(row,col,{Items:[
            { Name:row.Deleted?"Undelete row":"Delete row",OnClick:function(){ G.DeleteRow(row,row.Deleted?3:1); } },
            { Name:row.Selected?"Deselect row":"Select row",OnClick:function(){ G.SelectRow(row); } },
            { Name:"Copy row",OnClick:function(){ G.CopyRow(row,null,row,1,0); } },
            { Name:"Add new row",OnClick:function(){ G.AddRow(null,row,1); } }
            ]});
         return 1;
         }
      },

   created: function () {
      // Handles loading error
      TGSetEvent("OnLoadError","SampleGrid",function(grid){ alert("TreeGrid cannot load!\nCheck if the NodeJS server runs on the url http://localhost:8000\nThe sample NodeJS server is located in /ExamplesNode/Server"); });

      // Links TreeGrid and Vue component after TreeGrid loading or reloading with new data when TreeGrid is created by <treegrid> tag
      // var Component = this; TGSetEvent("OnInit","SampleGrid",function(grid){ grid.Component = Component; Component.Grid = grid; });
      },

   mounted: function(){
      // StartTreeGrid(); // Processes all newly rendered <treegrid> tags on page, uncomment it if the component is not mounted on page load and grid is created by <treegrid> tag

      // Creates TreeGrid dynamically. "TreeGridMainTag" is the tag defined in HTML to be the grid rendered to. 
      // By the id value the grid will be accessible for global API like window.Grids.SampleGrid.Reload();
      // Links the Vue component to the created grid as Grid.Component and the grid to Vue component by the this.Grid
      this.Grid = TreeGrid(
         { 
         Debug:'check', id:'SampleGrid', 
         Layout: { Url:"static/Layouts/StaticDef.js" }, 
         Data: { Url:"static/Layouts/StaticData.js" },
         ExportPDF:{Url:"http://localhost:8000/getpdf", Type:"Cfg,Def,Cols,All"}
         },
         "TreeGridMainTag",
         { Component:this }
         );
      },

   destroyed: function(){
      this.Grid.Dispose();
      }
   }
</script>
