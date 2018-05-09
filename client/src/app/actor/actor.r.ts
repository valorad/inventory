import { RouterModule, Route } from '@angular/router';

import { ActorComponent } from "./actor.c";
import { ActorSelectComponent } from "./actor-select/actor-select.c";

const actorRoutes: Route[] = [
  {
    path: "",
    pathMatch: 'full',
    component: ActorComponent
  },
  {
    path: "select",
    component: ActorSelectComponent
  }
];

export const actorRouter = RouterModule.forChild(actorRoutes);