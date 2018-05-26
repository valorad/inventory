import { RouterModule, Route } from '@angular/router';

import { InventoryComponent } from "./inventory.c";

const inventoryRoutes: Route[] = [
  {
    path: "",
    component: InventoryComponent,
    children: [
      {
        path: "skyui",
        loadChildren: './skyui/skyui.m#SkyUIModule'
      }
    ]
  }
];

export const inventoryRouter = RouterModule.forChild(inventoryRoutes);