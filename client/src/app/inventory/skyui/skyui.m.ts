import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// mat modules
import { CdkTableModule } from '@angular/cdk/table';

// componets
import { SkyUIComponent } from './skyui.c';

// router
import { skyuiRouter } from './skyui.r';

const matModules = [
  CdkTableModule
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    matModules,

    skyuiRouter
  ],
  declarations: [
    SkyUIComponent
  ]
})
export class SkyUIModule { }