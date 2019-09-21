<template>
  <div id="app">
     <link rel="stylesheet" href="Index.css" />
     <div class="ExampleName">TreeGrid in Vue and NodeJS server</div>
     <div class="ExampleShort">Example using <b>TypeScript</b>; Creates TreeGrid statically by &lt;treegrid> tag</div>
     <div class="ExampleShort">Creates grid from and saves changes back to database on NodeJS server and SQLite3 database or static file</div>

     <!-- Links to examples -->
     <sample-links>
     </sample-links>

     <!-- Example descriptions -->
     <div class="ExampleDesc">
        <i>Source files:</i> <a id='LayoutLink' href="Layouts/StaticDef.js" target="_blank">
           <h4 id="LayoutName">Layouts/StaticDef.js</h4>
        </a> (static JSON layout),
        <a id='DataLink' href="Layouts/StaticData.js" target="_blank">
           <h4 id="DataName">Layouts/StaticData.js</h4>
        </a><span id="DataDesc"> (static JSON data)</span>
     </div>
     <div class="ExampleDesc">
        The <b>Static</b> file example loads data directly without server and cannot upload changes.
        The <b>SQL</b> examples use <h4>SQLite3</h4> <b>SQLite.db</b> file as source SQL database.
        The <b>Sheet</b> example loads and saves the whole data on server as file.
     </div>

     <div class="ExampleBorder">

        <!-- TreeGrid main tag, it will contain the grid -->
        <tree-grid-main-tag class="ExampleMain" style='width:"100%",height:"530px"'></tree-grid-main-tag>

     </div>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SampleLinks from './components/SampleLinks';
import TreeGridMainTag from './components/TreeGridMainTag.vue';

export default Vue.extend({
   name: 'app',
   components: {
      SampleLinks,
      TreeGridMainTag
      }
   });
</script>

<style>
   /* Styles for TreeGrid example, it is not required for TreeGrid usage */
   .ExampleHeader { font:normal 16px Arial; color:blue; text-align:center; }
   .ExampleHeader b { color:#800; }
   .ExampleHeader i { color:black; font-style:normal; font-weight:bold; }
   .ExampleHeader u { text-decoration:none; color:#0B0; font-weight:bold; padding:0px 2px 0px 2px; }
   .ExampleName { font:bold 30px Arial; padding:5px 0px 5px 0px; text-align:center; }
   .ExampleShort { font:italic 15px Arial; margin-bottom:10px; padding-top:5px; text-align:center; }
   .ExampleDesc { margin:0px 5px 10px 5px; padding:5px; border:1px solid #AAA; }
   .ExampleErr { margin:50px auto 10px auto; padding:5px; line-height:30px; border:1px solid black; color:red; width:800px; text-align:center; display:none; }
   .ExampleBorder { margin:0px 5px 0px 5px; clear:both; zoom:1; }
   .ExampleDesc ul { padding:0px 0px 0px 15px; margin:10px 0px 0px 0px; }
   .ExampleDesc li { padding-bottom:8px; line-height:18px; }
   .ExampleDesc h4 { display:inline; font:bold 15px Arial; line-height:20px; padding-left:6px; padding-right:6px; background:#87DAE5; border:1px solid #888; color:black; margin:0px; font-style:normal; }
   .ExampleDesc u { text-decoration:none; font-size:11px; }
   .ExampleDesc .Link { text-decoration:underline; color:blue; cursor:pointer; }
   .ExampleDesc .Tile { font-weight:bold; }
   .ExampleNav { }
   .ExampleNav .Title { font-weight:bold; }
   .ExampleNav .Link { margin-left:10px; text-decoration:underline; color:blue; cursor:pointer; }
   .ExampleNav .Active { color:green; font-weight:bold; }
</style>