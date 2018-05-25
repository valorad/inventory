import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DialogSelectComponent } from './dialog-select/dialog-select.c';

// import * as tingle from 'tingle.js';


@Component({
	selector: 'actor-select',
	templateUrl: './select.c.html',
	styleUrls: [
		'../list.scss',
		'./select.c.scss'
	]
})
export class SelectComponent implements OnInit {

	deps: any = {};


	constructor (
		public matDialog: MatDialog
	) {

	}

	selectState: any = {};

	openSelectDialog = (index: number) => {
		let dialog = this.matDialog.open(DialogSelectComponent, {
			data: this.dummyPlayers[index]
		});

		dialog.afterClosed().subscribe(
			(result) => {
				if (result) {
					this.selectState = result;
					console.log(result);
				}
			}
		);

		// let dialog = new tingle.modal({
		// 	footer: true
		// });

		// dialog.setContent('<h1>here\'s some content</h1>');

		// dialog.open();

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
























