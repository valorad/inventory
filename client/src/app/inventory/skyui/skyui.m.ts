import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// componets
import { SkyUIComponent } from './skyui.c';

// router
import { skyuiRouter } from './skyui.r';

@NgModule({
  imports: [
    CommonModule,

    skyuiRouter
  ],
  declarations: [
    SkyUIComponent
  ]
})
export class SkyUIModule { }