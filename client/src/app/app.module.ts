import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';

// other components
import { IndexComponent } from "./index/index.c";
import { Http404Component } from "./http404/http404.c";

// router
import { appRouter } from "./app.router";


@NgModule({
  imports: [
    BrowserModule,

    appRouter
  ],
  declarations: [
    AppComponent,

    IndexComponent,
    Http404Component
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }