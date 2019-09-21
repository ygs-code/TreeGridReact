// Simple TreeGrid component, defines the <treegrid> tag to use in Angular page 
// Import it and declare in the module where <treegrid> tag is used

import {
   AfterViewInit,
   Component
} from '@angular/core';

@Component({
   selector: 'treegrid',
   template: `<div></div>`
   })

export class TreeGridComponent implements AfterViewInit {
   public ngAfterViewInit() {
      
      // Assign here the Grid API events
      // For example: Grids.OnRenderFinish = function(G){ alert("Grid is rendered!"); }
      //    or by SetEvent: TGSetEvent("OnRenderFinish",null,function(G){ alert("Grid is rendered!"); });
      // The created grid can is accessible for API as Grids.grid_id, where grid_id is the id set in <treegrid> tag or Cfg: {id:'...'} in input data. If there is only one grid on page, it can be accessed simply as Grids[0]

      StartTreeGrid(); // Processes all <treegrid> tags and creates grids from them. The grids are created asynchronously, except the <treegrid> has set Sync.

   }
}
