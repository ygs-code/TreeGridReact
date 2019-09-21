import React from 'react';
import './App.css';
import './TreeGrid.TypeScript.API.d.ts';

interface ISampleLinkProps {
  "data-Active"?: number;
  "data-Sample": string;
  "data-Comment"?: string;
  "data-Text"?: string;
  "data-Parent"?: App;
}

// Component to show a link for reloading grid with another data
class SampleLink extends React.Component {
   render() {
      var P = this.props as ISampleLinkProps;
      return (
         <span><span className={"Link"+(P["data-Active"]?" Active":"")} onClick={(e) => P["data-Parent"]!.Reload(P["data-Sample"],e)}>{P["data-Text"]}</span><span> ({P["data-Comment"]||'SQL'})</span></span>
      )
   }
}

class App extends React.Component {

   // Links this React component with the created TreeGrid if created by <treegrid> tag. The React component will be accessible in grid events as Grid.Component and grid will be accessible from React code as this.Grid
   // The Grids.OnInit can be used only if there is only one TreeGrid on page. For more grids on page assign the event only for particular grid as: window.TGSetEvent("OnInit",grid_id,function(grid){ grid.Component = Component; Component.Grid = grid; });
   Grid : any;
   constructor(props : any){
      super(props);
      var Component = this;
      window.Grids.OnInit = function (grid:any){ grid.Component = Component; Component.Grid = grid; };
      window.Grids.OnLoadError = function(grid:any){ alert("TreeGrid cannot load!\nCheck if the NodeJS server runs on the url http://localhost:8000\nThe sample NodeJS server is located in /ExamplesNode/Server"); }
      }

   // Reloads the grid with given data and layout
   // Called on click to the example links to show given example
   // string example: the example name to read the TreeGrid source object from the Examples list
   // Event event: standard JavaScript event, used to get the calling target   
   Reload(example : string, event : any){
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
      if(this.Grid!.Reload(Source)){ 
         // Updates the HTML links to show information for shown example
         for(var t=item.parentNode.parentNode.firstElementChild;t;t=t.nextElementSibling) if(t.firstElementChild&&t.firstElementChild.className.indexOf('Active')!=-1) t.firstElementChild.className = t.firstElementChild.className.replace(/\s+Active/,'');
         item.className += ' Active';
         (document.getElementById('LayoutLink') as HTMLAnchorElement)!.href = Source.Layout.Url; document.getElementById('LayoutName')!.innerHTML = Source.Layout.Url; 
         (document.getElementById('DataLink') as HTMLAnchorElement)!.href = Source.Data.Url; document.getElementById('DataName')!.innerHTML = Source.Data.Url;
         document.getElementById('DataDesc')!.innerHTML = example=="Static" ? " (static JSON data)" : example=="Sheet" ? " (server script loads JSON data from file)" : " (server script generates JSON data from database)";
         }
      }

   // React event handler called when the component is rendered
   componentDidMount() {
      // window.StartTreeGrid(); // Processes all newly rendered <treegrid> / <bdo> tags on page, call it if the component is not mounted on page load
      
      // Uncomment this line to load TreeGrid dynamically from script. If used, remove the <bdo> tag, the StartTreeGrid() call and the OnInit event that links grid to this class in constructor()
      //this.Grid = window.TreeGrid({ Debug:'check', id:'SampleGrid', Layout: { Url:"Layouts/StaticDef.js" }, Data: { Url:"Layouts/StaticData.js" }, ExportPDF:{Url:"http://localhost:8000/getpdf", Type:"Cfg,Def,Cols,All"} },"TreeGridMainTag",{ Component:this }); 
      }

   // React event handler called when the component is being removed
   componentWillUnmount() {
      this.Grid!.Dispose();
      }

   // Custom method to demonstrate calling React method from TreeGrid code
   // Called from TreeGrid json layout, from Action OnRightClickCell, except Sheet example
   // Shows simple custom menu and calls some basic TreeGrid API methods on menu item click
   showCustomMenu(row: TRow,col: string) {
      var G = this.Grid;
      this.Grid!.ShowMenu(row,col,{Items:[
         { Name:row.Deleted?"Undelete row":"Delete row",OnClick:function(){ G!.DeleteRow(row,row.Deleted?3:1); } as () => boolean },
         { Name:row.Selected?"Deselect row":"Select row",OnClick:function(){ G!.SelectRow(row); } },
         { Name:"Copy row",OnClick:function(){ G!.CopyRow(row,undefined,row,true,false); } },
         { Name:"Add new row",OnClick:function(){ G!.AddRow(undefined,row,1); } }
         ]});
      return 1;
      }

   // Renders the whole sample page
   render() {
      return (<div>

{/* Page headers */}
<div className="ExampleName">TreeGrid in React by <b>create-react-app</b> and NodeJS server</div>
<div className="ExampleShort">Creates grid from and saves changes back to database on NodeJS server and SQLite3 database or static file</div>

{/* Links to examples */}
<div className="ExampleNav ExampleDesc">
   <span className="Title">Examples:</span>
   <SampleLink data-Sample='Static' data-Text='Static file' data-Active='1' data-Comment="no upload" data-Parent={this}/> {/* Static file without upload link */}
   <SampleLink data-Sample='Table' data-Text='Plain table' data-Parent={this} /> {/* Plain table link */}
   <SampleLink data-Sample='Tree' data-Text='Tree table' data-Parent={this} /> {/* Tree table link */}
   <SampleLink data-Sample='GanttBasic' data-Text='Plain Gantt' data-Parent={this} /> {/* Plain Gantt link */}
   <SampleLink data-Sample='GanttTree' data-Text='Gantt tree' data-Parent={this} /> {/* Gantt tree link */}
   <SampleLink data-Sample='Run' data-Text='Run chart' data-Parent={this} /> {/* Run chart link */}
   <SampleLink data-Sample='Sheet' data-Text='Sheet' data-Comment='file upload' data-Parent={this} /> {/* Sheet link */}

   {/* Plain links alternative without using the SampleLink
   <span><span className="Link Active" onClick={(e) => this.Reload('Static',e)}>Static file</span> (no upload)</span>
   <span><span className="Link" onClick={(e) => this.Reload('Table',e)}>Plain table</span> (SQL)</span>
   <span><span className="Link" onClick={(e) => this.Reload('Tree',e)}>Tree table</span> (SQL)</span>
   <span><span className="Link" onClick={(e) => this.Reload('GanttBasic',e)}>Plain Gantt</span> (SQL)</span>
   <span><span className="Link" onClick={(e) => this.Reload('GanttTree',e)}>Gantt tree</span> (SQL)</span>
   <span><span className="Link" onClick={(e) => this.Reload('Run',e)}>Run chart</span> (SQL)</span>
   <span><span className="Link" onClick={(e) => this.Reload('Sheet',e)}>Sheet</span> (file upload)</span>
   */}

</div>

{/* Example descriptions */}
<div className="ExampleDesc">
   <i>Source files:</i> <a id='LayoutLink' href="Layouts/StaticDef.js" target="_blank"><h4 id="LayoutName">Layouts/StaticDef.js</h4></a> (static JSON layout), 
   <a id='DataLink' href="Layouts/StaticData.js" target="_blank"> <h4 id="DataName">Layouts/StaticData.js</h4></a><span id="DataDesc"> (static JSON data)</span>
</div>
<div className="ExampleDesc">
   The <b>Static</b> file example loads data directly without server and cannot upload changes. 
   The <b>SQL</b> examples use <h4>SQLite3</h4> <b>SQLite.db</b> file as source SQL database.
   The <b>Sheet</b> example loads and saves the whole data on server as file.
</div>

<div className="ExampleBorder">

   {/* TreeGrid main tag, it will contain the grid */}
   <div className="ExampleMain" style={{width:"100%",height:"530px"}} id='TreeGridMainTag'>

      {/* TreeGrid definition */}
      {/* Displays the first example on load */}
      {/* <bdo> tag is used instead of <treegrid> tag to avoid TypeScript error for custom tag */}
      {/* By the id value the grid is accessible for global API like window.Grids.SampleGrid.Reload(); */}
      //@ts-ignore
      <bdo debug='check' id='SampleGrid'
         layout_url="Layouts/StaticDef.js" 
         data_url="Layouts/StaticData.js"
         exportpdf_url="http://localhost:8000/getpdf" exportpdf_type="Cfg,Def,Cols,All"
         ></bdo>

   </div>
</div>

</div>)
   }
}

export default App;
