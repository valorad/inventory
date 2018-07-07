import { Component, OnInit } from '@angular/core';

import { DataService } from '../../_services/data.s';

import { SkyuiDataSource } from './skyui.table';

interface IEquip {
	name: string,
	equip: string
}

interface IEffect {
	name: string,
	effect: string
}

interface InvItem {
  icon?: string, // to be assigned in the cdk table
	name?: string,
	description?: string,
	type?: string,
	typeName?: string,
  value?: number,
	weight?: number,
	rating?: number,
	equips: IEquip[]
	effects: IEffect[],
	quantity: number,
	bookContent?: string;

}

interface InvItemVerbose {
  holder: string,
  item: string,
  refDetails: any[],
  // item base info
  base: {
		dbname: string,
		name?: string,
		description?: string,
    value: number,
    weight: number,
    category: string,
    detail?: {
      rating?: number,
			type?: string,
			typeName: string,
      equipI18n?: any,
      effectsI18n?: any,
			content?: string,
			contentDetail?: string
    }
  }
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

	currentDetail = {} as InvItem;

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

			invItem.name = invV.base.name;
			invItem.description = invV.base.description;
			invItem.value = invV.base.value;
			invItem.weight = invV.base.weight;
			
			// {Waring!} This is wrong, because refitems has the exact quantity.
			// It isn't determined simply by ref length
			invItem.quantity = invV.refDetails.length;


			// details
			if (invV.base.detail) {
				invItem.rating = invV.base.detail.rating;
				invItem.type = invV.base.detail.type;
				invItem.typeName = invV.base.detail.typeName;
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
		} else {
			console.error(`Failed to switch to tab with dbname ${dbname}`);
		}
	};

	showDetail = (e: MouseEvent) => {
		let tr = e.srcElement as HTMLTableRowElement;
		let index = tr.rowIndex - 1;
		this.currentDetail = this.invItems[index];
		console.log(this.currentDetail);
	};

  main = async () => {
    // fetch data
		this.invItems = (this.extractData(await this.getInvItems())) || [];

		this.dataSource = new SkyuiDataSource(this.invItems);
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