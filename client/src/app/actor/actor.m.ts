import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// router
import { actorRouter } from "./actor.r";

// componets
import { ActorComponent } from './actor.c';
import { ActorSelectComponent } from "./actor-select/actor-select.c";

@NgModule({
  imports: [
    CommonModule,

    actorRouter
  ],
  declarations: [
    ActorComponent,
    ActorSelectComponent
  ]
})
export class ActorModule { }