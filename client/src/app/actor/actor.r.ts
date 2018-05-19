import { RouterModule, Route } from '@angular/router';

import { ActorComponent } from "./actor.c";

const actorRoutes: Route[] = [
  {
    path: "",
    component: ActorComponent,
    children: [
      {
        path: "select",
        loadChildren: './select/select.m#SelectModule'
      }
    ]
  }
];

export const actorRouter = RouterModule.forChild(actorRoutes);