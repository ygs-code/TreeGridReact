import { Component } from '@angular/core';
@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css']
})

export class AppComponent {
   title = 'V6';

   public Grid: any;

   constructor(){

      // Links this Angular component with the created TreeGrid. The Angular component will be accessible in grid events as Grid.Component and grid will be accessible from Angular code as this.Grid
      // The Grids.OnInit can be used only if there is only one TreeGrid on page. For more grids on page assign the event only for particular grid as: TGSetEvent("OnInit",grid_id,function(grid){ grid.Component = Component; Component.Grid = grid; });
      var Component = this;
      Grids.OnInit = function(grid:any){ grid!.Component = Component; Component.Grid = grid; }
      Grids.OnLoadError = function(grid:any){ alert("TreeGrid cannot load!\nCheck if the NodeJS server runs on the url http://localhost:8000\nThe sample NodeJS server is located in /ExamplesNode/Server"); }
      }


   // Reloads the grid with given data and layout
   // Called on click to the example links to show given example
   // string example: the example name to read the TreeGrid source object from the Examples list
   // Event event: standard JavaScript event, used to get the calling target
   public Reload(example: string, event: any) {

      // List of examples
      var Examples : any = {
         Static: { 
            Layout:{Url:'Layouts/StaticDef.js'}, 
            Data:{Url:'Layouts/StaticData.js'},
            ExportPDF:{Url:"http://localhost:8000/getpdf", Type:"Cfg,Def,Cols,All"}
            },
         Table: { 
            Layout:{Url:'Layouts/TableDef.js'}, 
            Data:{Url:'http://localhost:8000/get?table=TableData&idcol=ID'},
            Upload:{Url:'http://localhost:8000/set?table=TableData&idcol=ID', Format:'JSON', Data:'Data'},
            ExportPDF:{Url:"http://localhost:8000/getpdf?data=get%3Ftable%3DTableData%26idcol%3DID", Type:"Cfg,Def,Cols,Fixed,Changes"}
            },
         Tree: { 
            Layout:{Url:'Layouts/TreeDef.js'}, 
            Data:{Url:'http://localhost:8000/get?table=TreeData&idcol=id&parentcol=Parent&footid=%23Foot'},
            Upload:{Url:'http://localhost:8000/set?table=TreeData&idcol=id&parentcol=Parent&footid=%23Foot', Format:'JSON', Data:'Data'},
            ExportPDF:{Url:"http://localhost:8000/getpdf?data=get%3Ftable%3DTreeData%26idcol%3Did%26parentcol%3DParent%26footid%3D%2523Foot", Type:"Cfg,Def,Cols,Fixed,Changes"}
            },
         GanttBasic: {
            Layout:{Url:'Layouts/GanttBasicDef.js'}, 
            Data:{Url:'http://localhost:8000/get?table=GanttBasic&idcol=id'},
            Upload:{Url:'http://localhost:8000/set?table=GanttBasic&idcol=id', Format:'JSON', Data:'Data'},
            ExportPDF:{Url:"http://localhost:8000/getpdf?data=get%3Ftable%3DGanttBasic%26idcol%3Did", Type:"Cfg,Def,Cols,Fixed,Changes"}
            },
         GanttTree: { 
            Layout:{Url:'Layouts/GanttTreeDef.js'}, 
            Data:{Url:'http://localhost:8000/get?table=GanttTree&idcol=id'},
            Upload:{Url:'http://localhost:8000/set?table=GanttTree&idcol=id', Format:'JSON', Data:'Data'},
            ExportPDF:{Url:"http://localhost:8000/getpdf?data=get%3Ftable%3DGanttTree%26idcol%3Did", Type:"Cfg,Def,Cols,Fixed,Changes"}
            },
         Run: { 
            Layout:{Url:'Layouts/RunDef.js'}, 
            Data:{Url:'http://localhost:8000/get?table=Run&idcol=id'},
            Upload:{Url:'http://localhost:8000/set?table=Run&idcol=id', Format:'JSON', Data:'Data'},
            ExportPDF:{Url:"http://localhost:8000/getpdf?data=get%3Ftable%3DRun%26idcol%3Did", Type:"Cfg,Def,Cols,Fixed,Changes"}
            },
         Sheet: { 
            Layout:{Url:'Layouts/SheetDef.js'}, 
            Data:{Url:'http://localhost:8000/getfile?file=SheetData.js'},
            Upload:{Url:'http://localhost:8000/setfile?file=SheetData.js', Format:'JSON', Data:'Data', Type:'Body,AutoCols,Focused'},
            ExportPDF:{Url:"http://localhost:8000/getpdf", Type:"Cfg,Def,Cols,All"}
            }
         }
      var Source = Examples[example], item = event.target;
      
      // Reloads grid with the new source
      // Creating new grid would be the same, it is just required to know tag to render to: var M = Grids[0].MainTag; Grids[0].Dispose(); TreeGrid(Source,M); // But note it will create grid with index 1, not 0
      if(this.Grid.Reload(Source)){ 

         // Updates the HTML links to show information for shown example
         for(var t=item.parentNode.firstElementChild;t;t=t.nextElementSibling) if(t.className.indexOf('Active')!=-1) t.className = t.className.replace(/\s+Active/,'');
         item.className += ' Active';
         (<HTMLAnchorElement>document.getElementById('LayoutLink'))!.href = Source.Layout.Url; document.getElementById('LayoutName')!.innerHTML = Source.Layout.Url; 
         (<HTMLAnchorElement>document.getElementById('DataLink'))!.href = Source.Data.Url; document.getElementById('DataName')!.innerHTML = Source.Data.Url;
         document.getElementById('DataDesc')!.innerHTML = example=="Static" ? " (static JSON data)" : example=="Sheet" ? " (server script loads JSON data from file)" : " (server script generates JSON data from database)";
         }
      }

      
   // Custom method to demonstrate calling Angular method from TreeGrid code
   // Called from TreeGrid json layout, from Action OnRightClickCell, except Sheet example
   // Shows simple custom menu and calls some basic TreeGrid API methods on menu item click
   public showCustomMenu(row: TRow, col: string) {
      var G = this.Grid;
      this.Grid.ShowMenu(row,col,{Items:[
         { Name:row.Deleted?"Undelete row":"Delete row",OnClick:function(){ G.DeleteRow(row,row.Deleted?3:1); } },
         { Name:row.Selected?"Deselect row":"Select row",OnClick:function(){ G.SelectRow(row); } },
         { Name:"Copy row",OnClick:function(){ G.CopyRow(row,null,row,1,0); } },
         { Name:"Add new row",OnClick:function(){ G.AddRow(null,row,1); } }
         ]});
      return 1;
      }
   }
