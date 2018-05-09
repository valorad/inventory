import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'actor-select',
	templateUrl: './select.c.html',
	styleUrls: [
		'../list.scss',
		'./select.c.scss'
	]
})
export class SelectComponent implements OnInit {

	dummyPlayers = Array(20).fill({
		dbname: "actor-dummy",
		name: "dummy actor",
		icon: null,
		equiped: {},
		biography: "Hello! I am a dummy."
	});

	constructor(
	) { }
	
	ngOnInit() {}

}