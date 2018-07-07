import { Component, OnInit } from '@angular/core';

import { DataService } from '../../_services/data.s';

import { SkyuiDataSource } from './skyui.data';

interface InvItems {
  icon?: string,
  name?: string,
  type?: string,
  value?: number,
  weight?: number
}

@Component({
	selector: 'inventory-skyui',
	templateUrl: './skyui.c.html',
	styleUrls: ['./skyui.c.scss']
})
export class SkyUIComponent implements OnInit {

	columnsToDisplay = ['icon', 'name', 'type', 'value', 'weight'];
	dataSource: SkyuiDataSource;

  getInvItems = () => {
    return new Promise<InvItems[]>((resolve, reject) => {
      this.dataService.getData("statics/dummy-items.json").subscribe(
        (data: InvItems[]) => {
					resolve(data);
        },
        (error: string) => {
          console.error(error);
        }
      );
    });

  };

  main = async () => {
    // fetch data
		let invItems: InvItems[] = (await this.getInvItems()) || [];
		console.log(invItems);
		this.dataSource = new SkyuiDataSource(invItems);
		
  };


	constructor (
		private dataService: DataService
	) {
		this.main();
	}
	
	ngOnInit() {}

}