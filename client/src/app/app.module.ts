import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

// mat modules
import { MatToolbarModule } from '@angular/material/toolbar';

// other modules


// other components
import { IndexComponent } from "./index/index.c";
import { Http404Component } from "./http404/http404.c";

// router
import { appRouter } from "./app.router";

const matModules = [
  MatToolbarModule
]


@NgModule({
  imports: [
    BrowserModule,
    NoopAnimationsModule,

    matModules,

    appRouter
  ]
  ,
  declarations: [
    AppComponent,

    IndexComponent,
    Http404Component
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }