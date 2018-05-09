import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// router
import { actorRouter } from "./actor.r";

// componets
import { ActorComponent } from './actor.c';

@NgModule({
  imports: [
    CommonModule,

    actorRouter
  ],
  declarations: [
    ActorComponent
  ]
})
export class ActorModule { }