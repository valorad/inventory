import { Injectable } from '@angular/core';

import { InvItem, _1HWeaponEquipState } from '../_interfaces/invItem.i';
import { Actor } from '../_interfaces/actor.i';

import { InvItemService } from '../_services/invItem.s';
import { ActorService } from '../_services/actor.s';

@Injectable()
export class InventoryService {

  getInvItems = async () => {
    return (await this.invItemService.extractInvItems()) || [];
  };

	equipArmor = (invItem: InvItem, actor: Actor) => {

		// get slots
		let slotsToTake = this.invItemService.getSlotsToTake(invItem.equipSlots);

		// modify actor
    this.actorService.equip(actor.equiped, invItem.id, slotsToTake);

    invItem.equipState.equiped = true;
  
    return slotsToTake;

	};

	equipWeapon = (invItem: InvItem, actor: Actor, _1HWeaponEquipOption?: _1HWeaponEquipState) => {

    let positionToEquip = this.invItemService.getWeaponPosEquip(invItem, _1HWeaponEquipOption);

    let newEquipState = this.actorService.equip(actor.equiped, invItem.id, positionToEquip);
    
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

    return newEquipState;

  };
  
	unequipArmor = (invItem: InvItem, actor: Actor) => {

    let newEquipState = this.actorService.unequip(actor.equiped, invItem.id);

    invItem.equipState.equiped = false;

    return newEquipState;
    
  };
  
  	/**
	 * Will unequip a specific weapon from inventory
	 * @param _1HWeaponUnequipOption Optional, decides whether to remove left hand or right hand for 1H weapons. Has no effect with other weapon types
	 */
	unequipWeapon = (invItem: InvItem, actor: Actor, _1HWeaponUnequipOption?: _1HWeaponEquipState) => {

		let unequipInfo = this.invItemService.getWeaponPosUnequip(invItem, _1HWeaponUnequipOption);

		let newEquipState = this.actorService.unequipFrom(actor.equiped, unequipInfo.positionToUnequip);

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

		return newEquipState;

  };
  
  changeArmor = (invItems: InvItem[], invItemNew: InvItem, actor: Actor) => {

		let slotsNew = this.invItemService.getSlotsToTake(invItemNew.equipSlots);
		let invIDToReplace: string;
		let invItemToReplace: InvItem;

		if (slotsNew.length > 0) {
			invIDToReplace = actor.equiped[slotsNew[0]];
		}

		if (invIDToReplace) {
			invItemToReplace = this.invItemService.findInvItem(invIDToReplace, invItems);
			this.unequipArmor(invItemToReplace, actor);
		}

		if (!invItemToReplace || invItemToReplace && invItemToReplace.id !== invItemNew.id) {
			this.equipArmor(invItemNew, actor);
    }
    
    return actor.equiped;
		
  };
  
  changeWeapon = (invItems: InvItem[], invItemNew: InvItem, actor: Actor, _1HWeaponChangeOption?: _1HWeaponEquipState) => {
		
		let slotsNew = this.invItemService.getSlotsToTake(invItemNew.equipSlots);

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
					invIDToReplace = actor.equiped["equip-hand-left"];
				}
				if (_1HWeaponChangeOption.right) {
					invIDToReplace = actor.equiped["equip-hand-right"];
				}

			} else {
				let validSlot: string;
				// case "equip-hand-left" and/or "equip-hand-right"
				for (let slot of slotsNew) {
					if (actor.equiped[slot]) {
						validSlot = slot;
						break;
					}
				}

				if (validSlot) {
					invIDToReplace = actor.equiped[validSlot];
				}
			}
		}

		if (invIDToReplace) {
			invItemToReplace = this.invItemService.findInvItem(invIDToReplace, invItems);
			slotsOld = this.invItemService.getSlotsToTake(invItemToReplace.equipSlots);

			// only when both new and old weapon is "either-hand" is the option valid.
			if (
				slotsNew.length === 1 &&
				slotsNew[0] === "equip-hand-either" &&
				slotsOld &&
				slotsOld.length === 1 &&
				slotsOld[0] === "equip-hand-either"
			) {

				this.unequipWeapon(invItemToReplace, actor, _1HWeaponChangeOption);

			} else {
				
				this.unequipWeapon(invItemToReplace, actor, {
					left: true,
					right: true
				});

			}

		}

		// cannot equip an 1H weapon on both left/right hands (if quantity < 2)

		if (slotsNew.includes("equip-hand-either") && invItemNew.quantity < 2) {

			this.unequipWeapon(invItemNew, actor, {
				left: true,
				right: true
			});

		}

		if (!invItemToReplace || invItemToReplace && invItemToReplace.id !== invItemNew.id) {
			this.equipWeapon(invItemNew, actor, _1HWeaponChangeOption);
		}

  };
  
	removeItem = (invItems: InvItem[], invItemToRemove: InvItem, num: number, actor: Actor) => {

		let quantityAfter = this.invItemService.removeItem(invItemToRemove, num).quantity;


		// weapon dropped from 2 to 1
		if (quantityAfter == 1 && invItemToRemove.category === "category-weapons") {
			// unequip an "either-hand" weapon if equiped
			let equipSlots = this.invItemService.getSlotsToTake(invItemToRemove.equipSlots);
			if (
			 equipSlots.includes("equip-hand-either") && 
			 invItemToRemove.equipState.lefthand &&
			 invItemToRemove.equipState.righthand) {
				// when the weapon is an "either-hand" weapon,
				// and only when both left and right hand are equiped at the same time,
				// we unequip the left hand
				this.unequipWeapon(invItemToRemove, actor, {left: true, right: false});
			}
		}

		// item dropped from 1 to 0
		if (quantityAfter <= 0) {
			// when quantity reaches 0
			// unequip if equiped
			if (invItemToRemove.equipState.equiped) {
				switch (invItemToRemove.category) {
					case "category-apparel":
						this.unequipArmor(invItemToRemove, actor);
					break;
					case "category-weapons":
						this.unequipWeapon(invItemToRemove, actor);
						break;
					default:
						break;
				}
			}

			// delete invItem
			let index = this.invItemService.findInvItemIndex(invItemToRemove.id, invItems);
      invItems.splice(index, 1);

      return {
        invItemToRemove,
        quantityAfter
      };

		}

	};


  constructor(
    private invItemService: InvItemService,
    private actorService: ActorService
  ) { }

}
