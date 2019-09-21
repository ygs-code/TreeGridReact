<!-- One link (<sample-link>) to TreeGrid sample, the links are generated in loop v-for in <sample-links> component -->
<template>
   <span>
      <span v-on:click="Click(link.Source,$event,link.id);" :class="link.Active?'Link Active':'Link'">{{link.Text}}</span>
      ({{link.Comment?link.Comment:"SQL"}})
   </span>
</template>
<script>
export default {
  name: 'SampleLink',
  props: ['link'],
  methods: {
      Click : function(Source,event,example){
         var item = event.target;
         if(Grids.SampleGrid.Reload(Source)){ 
            // Updates the HTML links to show information for shown example
            for(var t=item.parentNode.parentNode.firstElementChild;t;t=t.nextElementSibling) if(t.firstElementChild&&t.firstElementChild.className.indexOf('Active')!=-1) t.firstElementChild.className = t.firstElementChild.className.replace(/\s+Active/,'');
            item.className += ' Active';
            document.getElementById('LayoutLink').href = Source.Layout.Url; document.getElementById('LayoutName').innerHTML = Source.Layout.Url; 
            document.getElementById('DataLink').href = Source.Data.Url; document.getElementById('DataName').innerHTML = Source.Data.Url;
            document.getElementById('DataDesc').innerHTML = example=="Static" ? " (static JSON data)" : example=="Sheet" ? " (server script loads JSON data from file)" : " (server script generates JSON data from database)";
            }
         }
      }
   }
</script>