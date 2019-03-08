import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ActorService } from 'src/app/_services/actor.s';
import { InventoryService } from 'src/app/_services/inventory.s';
import { SkyuiDataSource } from './skyui.table';

import { InvItem, InvItemVerbose } from "./invItem.interface";
import { DialogRemoveComponent } from './dialog-remove/dialog-remove.c';



interface CategoryTab {
	dbname: string,
	icon?: string,
	name?: string,
	active: boolean
}

interface _1HWeaponEquipState {
	left: boolean,
	right: boolean
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

	extractData = (invVs: InvItemVerbose[]) => {
		let extData: InvItem[] = [];
		for (let invV of invVs) {
			let invItem = {} as InvItem;

			invItem.id = invV.id;
			invItem.name = invV.base.name || invV.base.dbname;
			invItem.description = invV.base.description;
			invItem.value = invV.base.value;
			invItem.weight = invV.base.weight;
			invItem.equipState = {};
			
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
				invItem.equipSlots = invV.base.detail.equipI18n;
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

	findInvItem = (id: string) => {
		for (let item of this.filteredInvItems) {
			if (item.id === id) {
				return item;
			}
		}
		return {} as InvItem;
	};

	findInvItemIndex = (id: string) => {
		for (let i = 0; i < this.filteredInvItems.length; i++) {
			if (this.filteredInvItems[i].id === id) {
				return i;
			}
		}
		return -1;
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

		// get slots
		let slotsToTake = this.inventoryService.getSlotsToTake(invItem.equipSlots);

		// modify actor
		this.actorService.equip(this.actor.equiped, invItem.id, slotsToTake);

		// display changes
		invItem.equipState.equiped = true;
		this.updateDataTable();

	};

	equipWeapon = (invItem: InvItem, _1HWeaponEquipOption?: _1HWeaponEquipState) => {

		let positionToEquip = this.inventoryService.getWeaponPosEquip(invItem, _1HWeaponEquipOption);

		this.actorService.equip(this.actor.equiped, invItem.id, positionToEquip);

		// display changes
		invItem.equipState.equiped = true;

		for (let pos of positionToEquip) {
			switch (pos) {
				case "equip-hand-left":
					invItem.equipState.lefthand = true;
					break;
				case "equip-hand-right":
					invItem.equipState.righthand = true;
					break;
				default:
					break;
			}
		}
		
		this.updateDataTable();

	};

	unequipArmor = (invItem: InvItem) => {

		this.actorService.unequip(this.actor.equiped, invItem.id);

		// display changes
		invItem.equipState.equiped = false;
		this.updateDataTable();
	};

	/**
	 * Will unequip a specific weapon from inventory
	 * @param _1HWeaponUnequipOption Optional, decides whether to remove left hand or right hand for 1H weapons. Has no effect with other weapon types
	 */
	unequipWeapon = (invItem: InvItem, _1HWeaponUnequipOption?: _1HWeaponEquipState) => {

		let unequipInfo = this.inventoryService.getWeaponPosUnequip(invItem, _1HWeaponUnequipOption);

		this.actorService.unequipFrom(this.actor.equiped, unequipInfo.positionToUnequip);

		// display changes
		// -> dual-wielding
		if (unequipInfo.slotsToTake.includes("equip-hand-either") && _1HWeaponUnequipOption) {
			if (_1HWeaponUnequipOption.left) {
				invItem.equipState.lefthand = false;
			}
	
			if (_1HWeaponUnequipOption.right) {
				invItem.equipState.righthand = false;
			}
		} else {
			// -> two-handed weapon
			if (unequipInfo.slotsToTake.includes("equip-hand-left")) {
				invItem.equipState.lefthand = false;
			}

			if (unequipInfo.slotsToTake.includes("equip-hand-right")) {
				invItem.equipState.righthand = false;
			}

		}

		if (!invItem.equipState.lefthand && !invItem.equipState.righthand) {
			// both hands are empty, remove equip symbol
			invItem.equipState.equiped = false;
		}

		this.updateDataTable();

	};

	changeArmor = (invItemNew: InvItem) => {

		let slotsNew = this.inventoryService.getSlotsToTake(invItemNew.equipSlots);
		let invIDToReplace: string;
		let invItemToReplace: InvItem;

		if (slotsNew.length > 0) {
			invIDToReplace = this.actor.equiped[slotsNew[0]];
		}

		if (invIDToReplace) {
			invItemToReplace = this.findInvItem(invIDToReplace);
			this.unequipArmor(invItemToReplace);
		}

		if (!invItemToReplace || invItemToReplace && invItemToReplace.id !== invItemNew.id) {
			this.equipArmor(invItemNew);
		}
		
	};

	changeWeapon = (invItemNew: InvItem, _1HWeaponChangeOption?: _1HWeaponEquipState) => {
		
		let slotsNew = this.inventoryService.getSlotsToTake(invItemNew.equipSlots);

		let invIDToReplace: string;
		let invItemToReplace: InvItem;
		let slotsOld: string[];

		// find the invID of invItem to replace
		if (slotsNew.length > 0) {
			// case "equip-hand-either"
			let slotNew = slotsNew[0];
			
			if (slotNew === "equip-hand-either" && _1HWeaponChangeOption) {
				
				// translate "equip-hand-either" to left or right based on mouseclick
				if (_1HWeaponChangeOption.left) {
					invIDToReplace = this.actor.equiped["equip-hand-left"];
				}
				if (_1HWeaponChangeOption.right) {
					invIDToReplace = this.actor.equiped["equip-hand-right"];
				}

			} else {
				let validSlot: string;
				// case "equip-hand-left" and/or "equip-hand-right"
				for (let slot of slotsNew) {
					if (this.actor.equiped[slot]) {
						validSlot = slot;
						break;
					}
				}

				if (validSlot) {
					invIDToReplace = this.actor.equiped[validSlot];
				}
			}
		}

		if (invIDToReplace) {
			invItemToReplace = this.findInvItem(invIDToReplace);
			slotsOld = this.inventoryService.getSlotsToTake(invItemToReplace.equipSlots);

			// only when both new and old weapon is "either-hand" is the option valid.
			if (
				slotsNew.length === 1 &&
				slotsNew[0] === "equip-hand-either" &&
				slotsOld &&
				slotsOld.length === 1 &&
				slotsOld[0] === "equip-hand-either"
			) {

				this.unequipWeapon(invItemToReplace, _1HWeaponChangeOption);

			} else {
				
				this.unequipWeapon(invItemToReplace, {
					left: true,
					right: true
				});

			}

		}

		// cannot equip an 1H weapon on both left/right hands (if quantity < 2)

		if (slotsNew.includes("equip-hand-either") && invItemNew.quantity < 2) {

			this.unequipWeapon(invItemNew, {
				left: true,
				right: true
			});

		}

		if (!invItemToReplace || invItemToReplace && invItemToReplace.id !== invItemNew.id) {
			this.equipWeapon(invItemNew, _1HWeaponChangeOption);
		}

	};

	removeItem = (invItem: InvItem, num: number) => {

		invItem.quantity -= num;


		// weapon dropped from 2 to 1
		if (invItem.quantity == 1 && invItem.category === "category-weapons") {
			// unequip an "either-hand" weapon if equiped
			let equipSlots = this.inventoryService.getSlotsToTake(invItem.equipSlots);
			if (
			 equipSlots.includes("equip-hand-either") && 
			 invItem.equipState.lefthand &&
			 invItem.equipState.righthand) {
				// when the weapon is an "either-hand" weapon,
				// and only when both left and right hand are equiped at the same time,
				// we unequip the left hand
				this.unequipWeapon(invItem, {left: true, right: false});
			}
		}

		// item dropped from 1 to 0
		if (invItem.quantity <= 0) {
			// when quantity reaches 0
			// unequip if equiped
			if (invItem.equipState.equiped) {
				switch (invItem.category) {
					case "category-apparel":
						this.unequipArmor(invItem);
					break;
					case "category-weapons":
						this.unequipWeapon(invItem);
						break;
					default:
						break;
				}
			}

			// delete invItem
			let index = this.findInvItemIndex(invItem.id);
			this.filteredInvItems.splice(index, 1);
			this.updateDataTable();
		}

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
		this.invItems = (this.extractData(await this.inventoryService.getInvItems())) || [];
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
		private actorService: ActorService,
		private inventoryService: InventoryService
	) {
		this.main();
	}
	
	ngOnInit() {}

}