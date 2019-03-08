import { Injectable } from '@angular/core';

import { InvItem, InvItemVerbose } from "../_interfaces/invItem.interface";
import { DataService } from "./data.s";


interface _1HWeaponEquipState {
	left: boolean,
	right: boolean
}

@Injectable()
export class InventoryService {

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


  constructor(
    private dataService: DataService
  ) {  }



}
