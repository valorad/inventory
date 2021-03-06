import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// mat modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

// other modules

// services
import { DataService } from './_services/data.s';
import { ActorService } from "./_services/actor.s";
import { InvItemService } from './_services/invItem.s';

import { AppComponent } from './app.component';
// other components
import { IndexComponent } from "./index/index.c";
import { Http404Component } from "./http404/http404.c";

// router
import { appRouter } from "./app.router";

const matModules = [
  MatToolbarModule,
  MatSidenavModule,
  MatButtonModule,
  MatIconModule,
  MatListModule
]


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    matModules,

    appRouter
  ]
  ,
  declarations: [
    AppComponent,

    IndexComponent,
    Http404Component,
  ],
  providers: [
    DataService,
    ActorService,
    InvItemService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }