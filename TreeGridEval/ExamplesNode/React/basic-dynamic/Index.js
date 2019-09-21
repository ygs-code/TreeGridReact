"use strict";

// Component to show a link for reloading grid with another data
class SampleLink extends React.Component {
   render() {
      var T = this;
      return (
         <span><span className={"Link"+(this.props.Active?" Active":"")} onClick={(e) => T.props.Parent.Reload(T.props.Sample,e)}>{this.props.Text}</span><span> ({this.props.Comment||'SQL'})</span></span>
      )
   }
}

// Main application component
class Sample extends React.Component {

   Grid = null; // Reference to the created grid object
   constructor(){
      super();
      Grids.OnLoadError = function(grid){ alert("TreeGrid cannot load!\nCheck if the NodeJS server runs on the url http://localhost:8000\nThe sample NodeJS server is located in /ExamplesNode/Server"); }
      }

   // Reloads the grid with given data and layout
   // Called on click to the example links to show given example
   // string example: the example name to read the TreeGrid source object from the Examples list
   // Event event: standard JavaScript event, used to get the calling target   
   Reload(example,event){
      // List of examples
      var Examples = {
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
         for(var t=item.parentNode.parentNode.firstElementChild;t;t=t.nextElementSibling) if(t.firstElementChild&&t.firstElementChild.className.indexOf('Active')!=-1) t.firstElementChild.className = t.firstElementChild.className.replace(/\s+Active/,'');
         item.className += ' Active';
         document.getElementById('LayoutLink').href = Source.Layout.Url; document.getElementById('LayoutName').innerHTML = Source.Layout.Url; 
         document.getElementById('DataLink').href = Source.Data.Url; document.getElementById('DataName').innerHTML = Source.Data.Url;
         document.getElementById('DataDesc').innerHTML = example=="Static" ? " (static JSON data)" : example=="Sheet" ? " (server script loads JSON data from file)" : " (server script generates JSON data from database)";
         }
      }
   
   // React event handler called when the component is rendered
   componentDidMount() {
      // Creates TreeGrid dynamically. "TreeGridMainTag" is the tag defined in HTML to be the grid rendered to. 
      // By the id value the grid will be accessible for global API like window.Grids.SampleGrid.Reload();
      // Links the React component to the created grid as Grid.Component and the grid to React component by the this.Grid
      this.Grid = window.TreeGrid(
         { 
         Debug:'check', id:'SampleGrid', 
         Layout: { Url:"Layouts/StaticDef.js" }, 
         Data: { Url:"Layouts/StaticData.js" },
         ExportPDF:{Url:"http://localhost:8000/getpdf", Type:"Cfg,Def,Cols,All"}
         },
         "TreeGridMainTag",
         { Component:this }
         );
      }

   // React event handler called when the component is being removed
   componentWillUnmount() {
      this.Grid.Dispose();
      }

   // Custom method to demonstrate calling React method from TreeGrid code
   // Called from TreeGrid json layout, from Action OnRightClickCell, except Sheet example
   // Shows simple custom menu and calls some basic TreeGrid API methods on menu item click
   showCustomMenu(row,col) {
      var G = this.Grid;
      this.Grid.ShowMenu(row,col,{Items:[
         { Name:row.Deleted?"Undelete row":"Delete row",OnClick:function(){ G.DeleteRow(row,row.Deleted?3:1); } },
         { Name:row.Selected?"Deselect row":"Select row",OnClick:function(){ G.SelectRow(row); } },
         { Name:"Copy row",OnClick:function(){ G.CopyRow(row,null,row,1,0); } },
         { Name:"Add new row",OnClick:function(){ G.AddRow(null,row,1); } }
         ]});
      return 1;
      }

   // Renders the whole sample page
   render() {
      return (<div>

{/* Page headers */}
<div className="ExampleName">TreeGrid in plain React (without NodeJS) and NodeJS server</div>
<div className="ExampleShort">Simple example without any installation; Creates TreeGrid dynamically by TreeGrid() function</div>
<div className="ExampleShort">Creates grid from and saves changes back to database on NodeJS server and SQLite3 database or static file</div>

{/* Links to examples */}
<div className="ExampleNav ExampleDesc">
   <span className="Title">Examples:</span>
   <SampleLink Sample='Static' Text='Static file' Active='1' Comment="no upload" Parent={this}/> {/* Static file without upload link */}
   <SampleLink Sample='Table' Text='Plain table' Parent={this} /> {/* Plain table link */}
   <SampleLink Sample='Tree' Text='Tree table' Parent={this} /> {/* Tree table link */}
   <SampleLink Sample='GanttBasic' Text='Plain Gantt' Parent={this} /> {/* Plain Gantt link */}
   <SampleLink Sample='GanttTree' Text='Gantt tree' Parent={this} /> {/* Gantt tree link */}
   <SampleLink Sample='Run' Text='Run chart' Parent={this} /> {/* Run chart link */}
   <SampleLink Sample='Sheet' Text='Sheet' Comment='file upload' Parent={this} /> {/* Sheet link */}

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
   <i>Source files:</i> <a id='LayoutLink' href="Layouts/StaticDef.js" target="_blank"><h4 id="LayoutName">StaticDef.js</h4></a> (static JSON layout), 
   <a id='DataLink' href="Layouts/StaticData.js" target="_blank"> <h4 id="DataName">Layouts/StaticData.js</h4></a><span id="DataDesc"> (static JSON data)</span>
</div>
<div className="ExampleDesc">
   The <b>Static</b> file example loads data directly without server and cannot upload changes. 
   The <b>SQL</b> examples use <h4>SQLite3</h4> <b>SQLite.db</b> file as source SQL database.
   The <b>Sheet</b> example loads and saves the whole data on server as file.
</div>

<div className="ExampleBorder">

   {/* TreeGrid main tag, it will contain the grid. The id is used in TreeGrid() function call when creating the grid */}
   <div className="ExampleMain" style={{width:"100%",height:"530px"}} id='TreeGridMainTag'></div>
</div>

</div>)
   }
}