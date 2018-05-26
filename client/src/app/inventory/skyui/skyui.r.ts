import { RouterModule, Route } from '@angular/router';

import { SkyUIComponent } from './skyui.c';

const skyuiRoutes: Route[] = [
  {
    path: "**",
    component: SkyUIComponent
  }
];

export const skyuiRouter = RouterModule.forChild(skyuiRoutes);