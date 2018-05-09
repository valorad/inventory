import { RouterModule, Route } from '@angular/router';

import { ActorComponent } from "./actor.c";
import { SelectComponent } from './select/select.c';

const actorRoutes: Route[] = [
  {
    path: "",
    pathMatch: 'full',
    component: ActorComponent
  },
  {
    path: "select",
    component: SelectComponent
    // unable to lazyload 2nd depth module because of the weird "Cyclic dependency error"
    // https://github.com/angular/angular/issues/15652
    // https://github.com/marcelklehr/toposort/issues/20
  }
];

export const actorRouter = RouterModule.forChild(actorRoutes);