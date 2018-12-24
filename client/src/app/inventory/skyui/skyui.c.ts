import { Component, OnInit } from '@angular/core';
// import { of } from 'rxjs';
// import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { DataService } from '../../_services/data.s';

import { SkyuiDataSource } from './skyui.table';

import { InvItem, InvItemVerbose } from "./invItem.interface";


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

	columnsToDisplay = ['icon', 'name', 'typeName', 'value', 'weight'];
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
			dbname: "category-weapons",
			icon: "icon-weapons",
			name: "Weapons",
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

	invItems: InvItem[] = [];
	filteredInvItemsByName: InvItem[] = [];
	filteredInvItems: InvItem[] = [];

	currentDetail = {} as InvItem;

	itemLoaded = false;

	_searchTerm = "";

	get searchTerm(): string {
		return this._searchTerm;
	}

	set searchTerm(val: string) {
		this._searchTerm = val;
		this.filteredInvItemsByName = this.filterByName(val);

		this.filterPipe(); // triggers filtering
	}

  getInvItems = () => {
    return new Promise<InvItemVerbose[]>((resolve, reject) => {
      this.dataService.getData("statics/dummy-items.json").subscribe(
        (data: InvItemVerbose[]) => {
					resolve(data);
        },
        (error: string) => {
          console.error(error);
        }
      );
    });

	};

	extractData = (invVs: InvItemVerbose[]) => {
		let extData: InvItem[] = [];
		for (let invV of invVs) {
			let invItem = {} as InvItem;

			invItem.name = invV.base.name || invV.base.dbname;
			invItem.description = invV.base.description;
			invItem.value = invV.base.value;
			invItem.weight = invV.base.weight;
			
			// count item number based on ref Detail
			invItem.quantity = 0;
			for (let refDetail of invV.refDetails) {
				invItem.quantity += refDetail.num;
			}

			// polyfill types for books and non-cate items
			// books
			if (invV.base.category === "books") {
				invItem.type = "type-book";
				invItem.typeName = "Books";
			}

			// non-cate misc
			if (!invV.base.category) {
				invItem.type = "type-misc";
				invItem.typeName = "Miscellaneous";
			}

			// details
			if (invV.base.detail) {
				invItem.rating = invV.base.detail.rating;
				if (invV.base.detail.type) {invItem.type = invV.base.detail.type;}
				if (invV.base.detail.typeName) invItem.typeName = invV.base.detail.typeName;
				invItem.equips = invV.base.detail.equipI18n;
				invItem.effects = invV.base.detail.effectsI18n;
				invItem.bookContent = invV.base.detail.contentDetail;
			}

			extData.push(invItem);
		}
		return extData;
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

			// filter items by category

			this.filterPipe(); // triggers filtering


		} else {
			console.error(`Failed to switch to tab with dbname ${dbname}`);
		}


	};

	showDetail = (e: MouseEvent) => {
		let tr = e.srcElement as HTMLTableRowElement;
		let index = tr.rowIndex - 1;
		this.currentDetail = this.filteredInvItems[index];
		console.log(this.currentDetail);
	};

	// filterByCategory = (dbname: string) => {
	// 	return this.invItems.filter(
	// 		invItem => invItem.typeName
	// 	)
	// };
	filterByName = (name: string) => {
		return this.invItems.filter(
			invItem => invItem.name.toLowerCase().includes(name.toLowerCase())
		);
	};

	filterByCategory = (dbname: string) => {

		if (dbname === "category-all-inventory") {

			return this.filteredInvItemsByName.filter(()=>{return true});

		} else {

			return this.filteredInvItemsByName.filter(
				(invItem) => {
					if (invItem.category) {
						return invItem.category === dbname
					} else {
						return "category-misc" === dbname
					}
				}
			);

		}


	}

	filterPipe = () => {
		this.filteredInvItemsByName = this.filterByName(this._searchTerm);
		this.filteredInvItems = this.filterByCategory(this.currentTab.dbname);
		this.updateDataTable();
	};

	updateDataTable = () => {
		this.dataSource = new SkyuiDataSource(this.filteredInvItems);
	};

  main = async () => {
		// activate default tab
		this.changeCategoryTab("category-all-inventory");

		// fetch data
		this.invItems = (this.extractData(await this.getInvItems())) || [];
		this.filteredInvItems = this.invItems;
		this.filteredInvItemsByName = this.invItems;

		this.updateDataTable();

		this.itemLoaded = true;

  };


	constructor (
		private dataService: DataService
	) {
		this.main();
	}
	
	ngOnInit() {}

}