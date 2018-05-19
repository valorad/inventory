import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'actor-select-dialog',
	templateUrl: './dialog-select.c.html',
	styleUrls: [
		'../../detail.scss',
		'./dialog-select.c.scss'
	]
})
export class DialogSelectComponent implements OnInit {

	cancel = () => {
		this.dialogRef.close("CANCEL");
	};

	constructor(
		public dialogRef: MatDialogRef<DialogSelectComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }
	
	ngOnInit() {}

}