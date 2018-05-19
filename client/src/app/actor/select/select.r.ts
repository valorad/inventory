import { RouterModule, Route } from '@angular/router';

import { SelectComponent } from './select.c';

const selectRoutes: Route[] = [
  {
    path: "**",
    component: SelectComponent
  }
];

export const selectRouter = RouterModule.forChild(selectRoutes);