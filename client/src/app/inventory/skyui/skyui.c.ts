import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { SkyuiDataSource } from './skyui.table';

import { DialogRemoveComponent } from './dialog-remove/dialog-remove.c';
import { InventoryService } from '../inventory.s';
import { _1HWeaponEquipState, InvItem } from 'src/app/_interfaces/invItem.i';


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

	// test data
	actor = {
		"dbname": "actor-dragonborn",
		"icon": null,
		"equiped": {},
		"name": "Dragonborn",
		"biography": "I am Dragonborn!"
	}

	columnsToDisplay = ['equip', 'icon', 'name', 'typeName', 'value', 'weight'];
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
		tr.focus();
		let index = tr.rowIndex - 1;
		this.currentDetail = this.filteredInvItems[index];
		console.log(this.currentDetail);
	};

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

	useItem = (e: MouseEvent) => {

		let _1HWeaponState: _1HWeaponEquipState = {
			left: false,
			right: false
		}

		switch (e.button) {
			case 0:
				// user left-clicked
				_1HWeaponState.right = true;
				break;
			case 2:
				// user right-clicked
				_1HWeaponState.left = true;
				break;
			default:	
				break;
		}

		switch (this.currentDetail.category) {
			
			case "category-apparel":

				this.changeArmor(this.currentDetail);
				break;

			case "category-weapons":

				this.changeWeapon(this.currentDetail, _1HWeaponState);
				break;

			case "category-potions":
			case "category-scrolls":
			case "category-food":
			case "category-ingredients":
				this.removeItem(this.currentDetail, 1);
				break;

			default:
				console.log("This item cannot be equiped");
				break;
		}

	};

	/**
	 * Handles Key-press event
	 */
	manipulateItem = (e: KeyboardEvent) => {
		switch (e.key) {
			case "r":
			case "R":
				// dropItem
				this.dropItem(this.currentDetail);
				break;

			default:
				break;
		}
	};

	/**
	 * The item is dropped if pressed R key
	 */
	dropItem = async (invItem: InvItem) => {
		if (invItem.quantity <= 5) {
			this.removeItem(invItem, 1);
		} else {
			let dropNum: number;
			try {
				dropNum = await this.openRemoveDialog(invItem);
			} catch (error) {
				console.log("User Cancelled drop Or some error occurs");
			}
			if (dropNum > 0) {
				this.removeItem(invItem, dropNum);
			}
		}
	};

	equipArmor = (invItem: InvItem) => {

		this.inventoryService.equipArmor(invItem, this.actor);

		// display changes
		this.updateDataTable();
	};

	equipWeapon = (invItem: InvItem, _1HWeaponEquipOption?: _1HWeaponEquipState) => {

		this.inventoryService.equipWeapon(invItem, this.actor, _1HWeaponEquipOption);

		// display changes
		this.updateDataTable();

	};

	unequipArmor = (invItem: InvItem) => {

		this.inventoryService.unequipArmor(invItem, this.actor)

		// display changes
		this.updateDataTable();
	};

	/**
	 * Will unequip a specific weapon from inventory
	 * @param _1HWeaponUnequipOption Optional, decides whether to remove left hand or right hand for 1H weapons. Has no effect with other weapon types
	 */
	unequipWeapon = (invItem: InvItem, _1HWeaponUnequipOption?: _1HWeaponEquipState) => {

		// let unequipInfo = this.invItemService.getWeaponPosUnequip(invItem, _1HWeaponUnequipOption);

		// this.actorService.unequipFrom(this.actor.equiped, unequipInfo.positionToUnequip);

		this.inventoryService.unequipWeapon(invItem, this.actor, _1HWeaponUnequipOption);

		// display changes
		this.updateDataTable();

	};

	changeArmor = (invItemNew: InvItem) => {

		this.inventoryService.changeArmor(this.filteredInvItems, invItemNew, this.actor);
		
	};

	changeWeapon = (invItemNew: InvItem, _1HWeaponChangeOption?: _1HWeaponEquipState) => {
		
		this.inventoryService.changeWeapon(this.filteredInvItems, invItemNew, this.actor, _1HWeaponChangeOption);

	};

	removeItem = (invItem: InvItem, num: number) => {

		this.inventoryService.removeItem(this.filteredInvItems, invItem, num, this.actor);

		this.updateDataTable();

	};

	openRemoveDialog = (invItem: InvItem): Promise<number> => {
		let dialog = this.matDialog.open(DialogRemoveComponent, {
			data: invItem
		});

		return new Promise((resolve, reject) => {
			dialog.afterClosed().subscribe(
				(result: number) => {
					if (result >= 0) {
						resolve(result);
					} else {
						reject(-1);
					}
				}
			);
		});

	};


  main = async () => {
		// activate default tab
		this.changeCategoryTab("category-all-inventory");

		// fetch data
		this.invItems = await this.inventoryService.getInvItems();
		this.filteredInvItems = this.invItems;
		this.filteredInvItemsByName = this.invItems;

		this.updateDataTable();

		this.itemLoaded = true;

	};
	
	// debug methods
	wl = (s: string) => {
		console.log(s);
	};


	constructor (
		private matDialog: MatDialog,
		// private actorService: ActorService,
		// private invItemService: InvItemService,
		private inventoryService: InventoryService
	) {
		this.main();
	}
	
	ngOnInit() {}

}