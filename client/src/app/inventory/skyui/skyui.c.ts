import { Component, OnInit } from '@angular/core';

import { SkyuiDataSource } from './skyui.data';

@Component({
	selector: 'inventory-skyui',
	templateUrl: './skyui.c.html',
	styleUrls: ['./skyui.c.scss']
})
export class SkyUIComponent implements OnInit {

	columnsToDisplay = ['icon', 'name', 'type', 'value', 'weight'];
	dataSource = new SkyuiDataSource();

	constructor(
	) { }
	
	ngOnInit() {}

}