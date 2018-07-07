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

interface CategoryTab {
	dbname: string,
	icon?: string,
	name?: string,
	active: boolean
}

@Component({
	selector: 'inventory-skyui',
	templateUrl: './skyui.c.html',
	styleUrls: ['./skyui.c.scss']
})
export class SkyUIComponent implements OnInit {

	columnsToDisplay = ['icon', 'name', 'type', 'value', 'weight'];
	dataSource: SkyuiDataSource;
	tabs: CategoryTab[] = [
		{
			dbname: "category-favorites",
			icon: "icon-favorites",
			name: "Favorites",
			active: false
		},
		{
			dbname: "category-all-inventory",
			icon: "icon-all-inventory",
			name: "All",
			active: true
		},
		{
			dbname: "category-apparel",
			icon: "icon-apparel",
			name: "Apparel",
			active: false
		},
		{
			dbname: "category-potions",
			icon: "icon-potions",
			name: "Potions",
			active: false
		},
		{
			dbname: "category-scrolls",
			icon: "icon-scrolls",
			name: "Scrolls",
			active: false
		},
		{
			dbname: "category-food",
			icon: "icon-food",
			name: "Food",
			active: false
		},
		{
			dbname: "category-ingredients",
			icon: "icon-ingredients",
			name: "Ingredients",
			active: false
		},
		{
			dbname: "category-books",
			icon: "icon-books",
			name: "Books",
			active: false
		},
		{
			dbname: "category-keys",
			icon: "icon-keys",
			name: "Keys",
			active: false
		},
		{
			dbname: "category-misc",
			icon: "icon-misc",
			name: "Misc",
			active: false
		}
	];

	currentTab = {} as CategoryTab;

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

	findTab = (dbname: string) => {
		for (let tab of this.tabs) {
			if (tab.dbname === dbname) {
				return tab;
			}
		}
		return {};
	};
	
	changeCategoryTab = (dbname: string) => {
		// deactivate previous tab
		this.currentTab.active = false;

		// activate new tab by dbname
		let tab = this.findTab(dbname) as CategoryTab;
		if (tab.dbname) {
			tab.active = true;
			this.currentTab = tab;
		} else {
			console.error(`Failed to switch to tab with dbname ${dbname}`);
		}
	};

  main = async () => {
    // fetch data
		let invItems: InvItems[] = (await this.getInvItems()) || [];
		this.dataSource = new SkyuiDataSource(invItems);
		// activate default tab
		this.changeCategoryTab("category-all-inventory");
		
  };


	constructor (
		private dataService: DataService
	) {
		this.main();
	}
	
	ngOnInit() {}

}