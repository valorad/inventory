import { Injectable } from '@angular/core';

import { InvItem, InvItemVerbose, _1HWeaponEquipState } from "../_interfaces/invItem.i";
import { DataService } from "./data.s";

@Injectable()
export class InvItemService {

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
	
	extractInvItems = async () => {

		let extInvItem: InvItem[] = [];
		let invVs: InvItemVerbose[] = await this.getInvItems();

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

			extInvItem.push(invItem);
		}
		return extInvItem;
	};
  
	getSlotsToTake = (equipSlotObjects: InvItem["equipSlots"]) => {
		let slots: string[] = [];

		for (let slot of equipSlotObjects) {
			slots.push(slot.equip);
		}

		return slots;
	};

	getWeaponPosEquip = (invItem: InvItem, _1HWeaponEquipOption?: _1HWeaponEquipState) => {

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

		return positionToEquip;

	};

	getWeaponPosUnequip = (invItem: InvItem, _1HWeaponUnequipOption?: _1HWeaponEquipState) => {

		// get slots
		let slotsToTake = this.getSlotsToTake(invItem.equipSlots);

		let positionToUnequip: string[] = [];

		// either-hand is special
		if (slotsToTake.includes("equip-hand-either") && _1HWeaponUnequipOption) {
			// right-click is to unequip left-hand
			if (_1HWeaponUnequipOption.left) {
				positionToUnequip.push("equip-hand-left");
			}

			if (_1HWeaponUnequipOption.right) {
					positionToUnequip.push("equip-hand-right");
			}

		} else {
			positionToUnequip = slotsToTake;
    }
    
    return {
      positionToUnequip,
      slotsToTake
    };

	};

	findInvItem = (id: string, invItem: InvItem[]) => {
		for (let item of invItem) {
			if (item.id === id) {
				return item;
			}
		}
		return {} as InvItem;
	};

	findInvItemIndex = (id: string, invItem: InvItem[]) => {
		for (let i = 0; i < invItem.length; i++) {
			if (invItem[i].id === id) {
				return i;
			}
		}
		return -1;
	};

	removeItem = (invItem: InvItem, num: number) => {
		invItem.quantity -= num;
		return invItem;
	}


  constructor(
    private dataService: DataService
  ) {  }



}
