import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InvItem } from '../invItem.interface';


@Component({
	selector: 'skyui-remove-dialog',
	templateUrl: './dialog-remove.c.html',
	styleUrls: [
		'./dialog-remove.c.scss'
	]
})
export class DialogRemoveComponent implements OnInit {

	numSelected: number = 1;

	ok = () => {
		this.dialogRef.close(this.numSelected);
	};

	cancel = () => {
		this.dialogRef.close(0);
	};

	constructor(
		public dialogRef: MatDialogRef<DialogRemoveComponent>,
		@Inject(MAT_DIALOG_DATA) public invItem: InvItem

	) {

	}
	
	ngOnInit() {}

}