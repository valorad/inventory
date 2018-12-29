import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// mat modules
import { CdkTableModule } from '@angular/cdk/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

// componets
import { SkyUIComponent } from './skyui.c';
import { DialogRemoveComponent } from './dialog-remove/dialog-remove.c';

// router
import { skyuiRouter } from './skyui.r';

const matModules = [
  MatDialogModule,
  CdkTableModule,
  MatSliderModule,
  MatButtonModule,
  MatInputModule
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    matModules,

    skyuiRouter
  ],
  declarations: [
    SkyUIComponent,
    DialogRemoveComponent
  ],
  entryComponents: [
    DialogRemoveComponent
  ],
})
export class SkyUIModule { }