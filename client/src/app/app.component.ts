import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy { 

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor (
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 992px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  };

  ngOnDestroy() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}


// import {Inject} from '@angular/core';
// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';




// @Component({
//   selector: 'dialog-overview-example',
//   template: 'dialog-overview-example.html'
// })
// export class DialogOverviewExample {

//   animal: string;
//   name: string;

//   constructor(public dialog: MatDialog) {}

//   openDialog(): void {
//     let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
//       width: '250px',
//       data: { name: this.name, animal: this.animal }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       console.log('The dialog was closed');
//       this.animal = result;
//     });
//   }

// }

// @Component({
//   selector: 'dialog-overview-example-dialog',
//   template: 'dialog-overview-example-dialog.html',
// })
// export class DialogOverviewExampleDialog {

//   constructor(
//     public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: any) { }

//   onNoClick(): void {
//     this.dialogRef.close();
//   }

// }