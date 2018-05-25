import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

interface IActor {
	[index: string]: any;
	
	dbname: string,
	name: string,
	icon: null,
	equiped: any,
	biography: string
}

@Component({
	selector: 'actor-select-dialog',
	templateUrl: './dialog-select.c.html',
	styleUrls: [
		'../../detail.scss',
		'./dialog-select.c.scss'
	]
})
export class DialogSelectComponent implements OnInit {

	data0: IActor = {
		dbname: "data-error",
		name: "data error",
		icon: null,
		equiped: {},
		biography: "data error."
	}

	cancel = () => {
		this.dialogRef.close(null);
	};

	ok = () => {
		this.dialogRef.close(this.data);
	};

	polyfillData = () => {
		for (let key in this.data0) {
			// if actor passed in has no required attribute
			// then polyfill it with a fallback one
			if (!this.data[key]) {
				this.data[key] = this.data0[key];
			}
		}
	};

	constructor(
		public dialogRef: MatDialogRef<DialogSelectComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any

	) {
		this.polyfillData();
	}
	
	ngOnInit() {}

}