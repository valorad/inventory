import { Component, OnInit } from '@angular/core';
import { NgxMasonryOptions } from 'ngx-masonry';

@Component({
	selector: 'app-index',
	templateUrl: './index.c.html',
	styleUrls: ['./index.c.scss']
})
export class IndexComponent implements OnInit {

	brickOptions: NgxMasonryOptions = {
		itemSelector: "brick"
	};

	constructor(
	) { }
	
	ngOnInit() {}

}