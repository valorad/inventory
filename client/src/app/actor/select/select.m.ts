import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// componets
import { SelectComponent } from './select.c';
import { DialogSelectComponent } from './dialog-select/dialog-select.c';

@NgModule({
  imports: [
    CommonModule,

  ],
  declarations: [
    SelectComponent,
    DialogSelectComponent
  ]
})
export class SelectModule { }