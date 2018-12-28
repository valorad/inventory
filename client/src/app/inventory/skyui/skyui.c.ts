import { Component, OnInit } from '@angular/core';
// import { of } from 'rxjs';
// import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { DataService } from '../../_services/data.s';

import { SkyuiDataSource } from './skyui.table';

import { InvItem, InvItemVerbose } from "./invItem.interface";
import { ActorService } from 'src/app/_services/actor.s';


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

		console.log(this.currentDetail.equipState);

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
				console.log("consumed 1");
				break;

			default:
				console.log("This item cannot be equiped");
				break;
		}

	};

	// equipItem = (options?: _1HWeaponEquipState) => {

	// 	let slotsToTake: string[] = [];

	// 	let weaponEquipState: _1HWeaponEquipState = {
	// 		left: false,
	// 		right: false
	// 	}

	// 	// get equip info from equips array
	// 	for (let slot of this.currentDetail.equipSlots) {

	// 		// either-hand slot is determined by how the user wants to equip
	// 		// rightclick is equiped left, left click is equiped right
	// 		// also for 2h weapons needs to mention equip state explicitly
	// 		switch (slot.equip) {
	// 			case "equip-hand-either":
	// 				if (options && options.left) {
	// 					slotsToTake.push("equip-hand-left");
	// 					weaponEquipState.left = true;
	// 				} else {
	// 					slotsToTake.push("equip-hand-right");
	// 					weaponEquipState.right = true;
	// 				}
	// 				this.unEquipEitherhand(weaponEquipState);
	// 				break;
	// 			default:
	// 				slotsToTake.push(slot.equip);
	// 				break;
	// 		}

	// 	}

	// 	// if slot is taken, need to unequip then equip
	// 	for (let slot of slotsToTake) {

	// 		if (this.actor.equiped[slot]) {

	// 			// a slot conflict is detected, trying to unequip
	// 			this.unEquipItemFrom(slot);

	// 		}


	// 		// also present changes for weapon slots
	// 		if (slot === "equip-hand-left") {
	// 			this.currentDetail.equipState.lefthand = true;
	// 		}

	// 		if (slot === "equip-hand-right") {
	// 			this.currentDetail.equipState.righthand = true;
	// 		}

	// 	}

	// 	// -> slot is now blank, just fill in
	// 	this.actor.equiped = this.actorService.equip(this.actor.equiped, this.currentDetail.id, slotsToTake);

	// 	console.log(this.actor.equiped);

	// 	// present equip state to the inventory interface

	// 	this.currentDetail.equipState.equiped = true;

	// 	// present changes on table
	// 	this.updateDataTable();

	// };

	// unEquipEitherhand = (options: _1HWeaponEquipState) => {

	// 	let slotToUnequip = "";

	// 	// if it's a weapon, specifically "either hand", then unequip based on mouseclick.
	// 	if (options.left) {
	// 		slotToUnequip = "equip-hand-left"
	// 	}
	// 	if (options.right) {
	// 		slotToUnequip = "equip-hand-right"
	// 	} 

	// 	this.unEquipItemFrom(slotToUnequip, options);
	// };

	// unEquipItem = () => {

	// 	let currentInvID = this.currentDetail.id;
	// 	let slotToUnequip = "";
	// 	// get current equip position in actor.equiped
	// 	let currentEquipedPos = "";
	// 	for (let key in this.actor.equiped) {
	// 		if (this.actor.equiped[key] === currentInvID) {
	// 			currentEquipedPos = key;
	// 		}
	// 	}

	// 	// armors / 2H weapons, then simply unequip
	// 	slotToUnequip = currentEquipedPos;
	// 	this.unEquipItemFrom(slotToUnequip);
	// };

	// /**
	//  * Will unequip all the slots with the same invID from the specified slot
	//  */
	// unEquipItemFrom = (slot: string, options?: _1HWeaponEquipState) => {

	// 	// an inv item may take up multiple slots (like armor sets or 2h weapons)
	// 	let itemslotsTaken: string[] = [];
	// 	let invIDOnSlot: string = this.actor.equiped[slot];

	// 	// add all taken slots with same invID to the array
	// 	for (let key in this.actor.equiped) {

	// 		if (this.actor.equiped[key] === invIDOnSlot) {
	// 			itemslotsTaken.push(key);
	// 		}
	// 	}

	// 	// TODO:
	// 	// for 1H weapons, unequiping one hand does not mean the other hand also need to unequip
	// 	// because both hands may hold same invID, not doing so may delete every hand.
	// 	// need to compare both "before" and "after" weapon,
	// 	// only both of them have "equips" property of "either hand" can we delete one hand
	// 	if (options && options.left) {

	// 		itemslotsTaken.splice(itemslotsTaken.indexOf("equip-hand-right"), 1);
	// 	}

	// 	if (options && options.right) {
	// 		itemslotsTaken.splice(itemslotsTaken.indexOf("equip-hand-left"), 1);
	// 	}

	// 	this.actor.equiped = this.actorService.unequipFrom(this.actor.equiped, itemslotsTaken);

	// 	this.unequipUpdateState(invIDOnSlot, options);

	// };

	// unequipUpdateState = (invID: string, options?: _1HWeaponEquipState) => {
	// 	// the equip icon state also needs to get updated
	// 	let invItemUnequiped = this.findInvItem(invID);
	// 	if (invItemUnequiped.id) {
		
	// 		// need to determine which hand is unequiped based on how the user mouseclicks
	// 		if (options) {

	// 			// 1h weapons, to unequip explicitly
	// 			if (options.left) {
	// 				invItemUnequiped.equipState.lefthand = false;
	// 			}

	// 			if (options.right) {
	// 				invItemUnequiped.equipState.righthand = false;
	// 			}

	// 			if (!invItemUnequiped.equipState.lefthand && !invItemUnequiped.equipState.righthand) {
	// 				// if both left hand and right hand is empty
	// 				console.log("both hands empty")
	// 				invItemUnequiped.equipState.equiped = false;
	// 			}
				
	// 		} else {

	// 			// may be 2h weapons or bows
	// 			invItemUnequiped.equipState.lefthand = false;
	// 			invItemUnequiped.equipState.righthand = false;
	// 			invItemUnequiped.equipState.equiped = false;
	// 		}
	// 	}
	// };

	getSlotsToTake = (equipSlotObjects: InvItem["equipSlots"]) => {
		let slots: string[] = [];

		for (let slot of equipSlotObjects) {
			slots.push(slot.equip);
		}

		return slots;
	};

	equipArmor = (invItem: InvItem) => {

		// get slots
		let slotsToTake = this.getSlotsToTake(invItem.equipSlots);

		// modify actor
		this.actorService.equip(this.actor.equiped, invItem.id, slotsToTake);

		// display changes
		invItem.equipState.equiped = true;
		this.updateDataTable();

	};

	equipWeapon = (invItem: InvItem, _1HWeaponEquipOption?: _1HWeaponEquipState) => {

		// get slots
		let slotsToTake = this.getSlotsToTake(invItem.equipSlots);

		let positionToEquip: string[] = [];

		// either-hand is special
		if (slotsToTake.includes("equip-hand-either") && _1HWeaponEquipOption) {
			// right-click is to equip left-hand
			if (_1HWeaponEquipOption.left) {
				positionToEquip.push("equip-hand-left")
			}

			if (_1HWeaponEquipOption.right) {
				positionToEquip.push("equip-hand-right")
			}

		} else {
			positionToEquip = slotsToTake;
		}

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

	unequipWeapon = (invItem: InvItem, _1HWeaponUnequipOption?: _1HWeaponEquipState) => {

		// get slots
		let slotsToTake = this.getSlotsToTake(invItem.equipSlots);

		let positionToUnequip: string[];

		// either-hand is special
		if (slotsToTake.includes("equip-hand-either") && _1HWeaponUnequipOption) {
			// right-click is to unequip left-hand
			if (_1HWeaponUnequipOption.left) {
				// positionToUnequip.splice(positionToUnequip.indexOf("equip-hand-right"), 1);
				positionToUnequip.push("equip-hand-left");
			}

			if (_1HWeaponUnequipOption.right) {
				// positionToUnequip.splice(positionToUnequip.indexOf("equip-hand-left"), 1);
				positionToUnequip.push("equip-hand-right");
			}

		} else {
			positionToUnequip = slotsToTake;
		}

		console.log(positionToUnequip);

		this.actorService.unequipFrom(this.actor.equiped, positionToUnequip);

		// display changes

		if (_1HWeaponUnequipOption.left) {
			invItem.equipState.lefthand = false;
		}

		if (_1HWeaponUnequipOption.right) {
			invItem.equipState.righthand = false;
		}

		if (!invItem.equipState.lefthand && !invItem.equipState.righthand) {
			// both hands are empty, remove equip symbol
			invItem.equipState.equiped = false;
		}

		this.updateDataTable();

	};

	changeArmor = (invItemNew: InvItem) => {

		let slotsNew = this.getSlotsToTake(invItemNew.equipSlots);
		let invIDToReplace: string;
		let invItemToReplace: InvItem;

		if (slotsNew.length > 0) {
			invIDToReplace = this.actor.equiped[slotsNew[0]];
		}

		if (invIDToReplace) {
			invItemToReplace = this.findInvItem(invIDToReplace);
			this.unequipArmor(invItemToReplace);
		}

		console.log(invItemNew, invItemToReplace)

		if (!invItemToReplace || invItemToReplace && invItemToReplace.id !== invItemNew.id) {
			this.equipArmor(invItemNew);
		}
		
	};

	changeWeapon = (invItemNew: InvItem, _1HWeaponChangeOption?: _1HWeaponEquipState) => {
		
		let slotsNew = this.getSlotsToTake(invItemNew.equipSlots);

		let invIDToReplace: string;
		let invItemToReplace: InvItem;
		let slotsOld: string[];

		if (slotsNew.length > 0) {
			invIDToReplace = this.actor.equiped[slotsNew[0]];
		}

		if (invIDToReplace) {
			invItemToReplace = this.findInvItem(invIDToReplace);
			slotsOld = this.getSlotsToTake(invItemToReplace.equipSlots);

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


		if (!invItemToReplace || invItemToReplace && invItemToReplace.id !== invItemNew.id) {
			this.equipWeapon(invItemNew, _1HWeaponChangeOption);
		}

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
	
	// debug methods
	wl = (s: string) => {
		console.log(s);
	};


	constructor (
		private dataService: DataService,
		private actorService: ActorService
	) {
		this.main();
	}
	
	ngOnInit() {}

}