import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-actor-select',
	templateUrl: './actor-select.c.html',
	styleUrls: [
		'../list.scss',
		'./actor-select.c.scss'
	]
})
export class ActorSelectComponent implements OnInit {

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