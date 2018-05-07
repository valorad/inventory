import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './index/index.c';
import { Http404Component } from './http404/http404.c';

const appRoutes = [
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
    path: '**',
    component: Http404Component
  }
];

export const appRouter = RouterModule.forRoot(appRoutes, { useHash: true });