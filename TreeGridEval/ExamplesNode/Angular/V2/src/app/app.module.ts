import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TreeGridComponent } from '../TreeGrid.component';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    AppComponent,
    TreeGridComponent
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
