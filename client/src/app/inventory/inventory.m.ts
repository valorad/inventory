import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { InventoryComponent } from './inventory.c';

// routes
import { inventoryRouter } from './inventory.r';

// services
import { InventoryService } from './inventory.s';

@NgModule({
  imports: [
    CommonModule,

    inventoryRouter
  ],
  declarations: [
    InventoryComponent
  ],
  providers: [
    InventoryService
  ]
})
export class InventoryModule { }