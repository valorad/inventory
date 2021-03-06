import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { DummyComponent } from './dummy.c';
import { DummyDirective } from './dummy.dr';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DummyDirective,

    DummyComponent
  ]
})
export class DummyModule { }