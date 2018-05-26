import { RouterModule, Route } from '@angular/router';

import { IndexComponent } from './index/index.c';
import { Http404Component } from './http404/http404.c';

const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/index', 
  },
  {
    path: 'index',
    component: IndexComponent
  },
  {
    path: 'actors',
    loadChildren: './actor/actor.m#ActorModule'
  },
  {
    path: 'inventory',
    loadChildren: './inventory/inventory.m#InventoryModule'
  },
  {
    path: '**',
    component: Http404Component
  }
];

export const appRouter = RouterModule.forRoot(appRoutes, { useHash: true });