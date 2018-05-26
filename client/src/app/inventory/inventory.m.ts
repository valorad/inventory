import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// componets
import { InventoryComponent } from './inventory.c';

// routes
import { inventoryRouter } from './inventory.r';

@NgModule({
  imports: [
    CommonModule,

    inventoryRouter
  ],
  declarations: [
    InventoryComponent
  ]
})
export class InventoryModule { }