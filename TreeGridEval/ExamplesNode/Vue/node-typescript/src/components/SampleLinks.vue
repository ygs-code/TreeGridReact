<!-- <sample-links> tag generates the individual links to TreeGrid examples -->
<template>
   <div class="ExampleNav ExampleDesc">
      <span class="Title">Examples:</span>
      <sample-link v-for="item in Examples" v-bind:link="item" v-bind:key="item.id"></sample-link>
   </div>
</template>
<script lang="ts">

import Vue from "vue";
import SampleLink from './SampleLink'

export default Vue.extend({
   name: 'SampleLinks',
   components: {
      SampleLink,
      },
   data: function(){
      return {
         // List of the examples for individual SampleLink, defines the data source to be reloaded to TreeGrid on link click
         Examples : {
            Static: { 
               id:'Static', Text: 'Static file', Active:1, Comment:'no upload', 
               Source:{
                  Layout:{Url:'Layouts/StaticDef.js'}, 
                  Data:{Url:'Layouts/StaticData.js'},
                  ExportPDF:{Url:"http://localhost:8000/getpdf", Type:"Cfg,Def,Cols,All"}
                  }
               },
            Table: { 
               id:'Table', Text:'Plain table', 
               Source:{
                  Layout:{Url:'Layouts/TableDef.js'}, 
                  Data:{Url:'http://localhost:8000/get?table=TableData&idcol=ID'},
                  Upload:{Url:'http://localhost:8000/set?table=TableData&idcol=ID', Format:'JSON', Data:'Data'},
                  ExportPDF:{Url:"http://localhost:8000/getpdf?data=get%3Ftable%3DTableData%26idcol%3DID", Type:"Cfg,Def,Cols,Fixed,Changes"}
                  }
               },
            Tree: { 
               id:'Tree', Text:'Tree table',
               Source: {
                  Layout:{Url:'Layouts/TreeDef.js'}, 
                  Data:{Url:'http://localhost:8000/get?table=TreeData&idcol=id&parentcol=Parent&footid=%23Foot'},
                  Upload:{Url:'http://localhost:8000/set?table=TreeData&idcol=id&parentcol=Parent&footid=%23Foot', Format:'JSON', Data:'Data'},
                  ExportPDF:{Url:"http://localhost:8000/getpdf?data=get%3Ftable%3DTreeData%26idcol%3Did%26parentcol%3DParent%26footid%3D%2523Foot", Type:"Cfg,Def,Cols,Fixed,Changes"}
                  }
               },
            GanttBasic: {
               id:'GanttBasic', Text:'Plain Gantt',
               Source: {
                  Layout:{Url:'Layouts/GanttBasicDef.js'}, 
                  Data:{Url:'http://localhost:8000/get?table=GanttBasic&idcol=id'},
                  Upload:{Url:'http://localhost:8000/set?table=GanttBasic&idcol=id', Format:'JSON', Data:'Data'},
                  ExportPDF:{Url:"http://localhost:8000/getpdf?data=get%3Ftable%3DGanttBasic%26idcol%3Did", Type:"Cfg,Def,Cols,Fixed,Changes"}
                  }
               },
            GanttTree: { 
               id:'GanttTree', Text:'Gantt tree',
               Source: {
                  Layout:{Url:'Layouts/GanttTreeDef.js'}, 
                  Data:{Url:'http://localhost:8000/get?table=GanttTree&idcol=id'},
                  Upload:{Url:'http://localhost:8000/set?table=GanttTree&idcol=id', Format:'JSON', Data:'Data'},
                  ExportPDF:{Url:"http://localhost:8000/getpdf?data=get%3Ftable%3DGanttTree%26idcol%3Did", Type:"Cfg,Def,Cols,Fixed,Changes"}
                  }
               },
            Run: { 
               id:'Run', Text:'Run chart',
               Source: {
                  Layout:{Url:'Layouts/RunDef.js'}, 
                  Data:{Url:'http://localhost:8000/get?table=Run&idcol=id'},
                  Upload:{Url:'http://localhost:8000/set?table=Run&idcol=id', Format:'JSON', Data:'Data'},
                  ExportPDF:{Url:"http://localhost:8000/getpdf?data=get%3Ftable%3DRun%26idcol%3Did", Type:"Cfg,Def,Cols,Fixed,Changes"}
                  }
               },
            Sheet: { 
               id:'Sheet', Text:'Sheet',
               Source: {
                  Layout:{Url:'Layouts/SheetDef.js'}, 
                  Data:{Url:'http://localhost:8000/getfile?file=SheetData.js'},
                  Upload:{Url:'http://localhost:8000/setfile?file=SheetData.js', Format:'JSON', Data:'Data', Type:'Body,AutoCols,Focused'},
                  ExportPDF:{Url:"http://localhost:8000/getpdf", Type:"Cfg,Def,Cols,All"}
                  }
               }
            }
         }
      }
   });
</script>