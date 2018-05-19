import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DialogSelectComponent } from './dialog-select/dialog-select.c';

@Component({
	selector: 'actor-select',
	templateUrl: './select.c.html',
	styleUrls: [
		'../list.scss',
		'./select.c.scss'
	]
})
export class SelectComponent implements OnInit {

	constructor (
		public matDialog: MatDialog
	) { }

	selectState: any = {};

	openSelectDialog = (dbname: string) => {
		let dialog = this.matDialog.open(DialogSelectComponent, {
			data: {
				dbname
			}
		});

		dialog.afterClosed().subscribe(
			(result) => {
				this.selectState.dbname = result;
			}
		);

	};

	dummyPlayers = Array(20).fill({
		dbname: "actor-dummy",
		name: "dummy actor",
		icon: null,
		equiped: {},
		biography: "Hello! I am a dummy."
	});
	
	ngOnInit() {}

}
























