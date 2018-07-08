import { InvItem, InvItemVerbose } from "./invItem.interface";

interface IconDict {
  [index: string]: string;
}

interface ArmorEquipDict {
  [index: string]: {
    [index: string]: string
  }
}

export class SkyUIIcon {

  armorTypes = [
    "type-armor",
    "type-garment",
    "type-lightarmor",
    "type-heavyarmor"
  ]

  armorEquipDict: ArmorEquipDict = {
    "equip-head": {
      "type-garment": "icon-clothing-head",
      "type-heavyarmor": "icon-armor-heavy-head",
      "type-lightarmor": "icon-armor-light-head"
    },
    "equip-neck": {
      "type-garment": "icon-armor-amulet"
    },
    "equip-feet": {
      "type-garment": "icon-clothing-shoes",
      "type-heavyarmor": "icon-armor-heavy-feet",
      "type-lightarmor": "icon-armor-light-feet"
    },
    "equip-forearms": {
      "type-garment": "icon-clothing-hands",
      "type-heavyarmor": "icon-armor-heavy-forearms",
      "type-lightarmor": "icon-armor-light-forearms"
    },
    "equip-face": {
      "type-garment": "icon-clothing-mask",
      "type-heavyarmor": "icon-armor-heavy-mask",
      "type-lightarmor": "icon-armor-light-mask"
    },
    "equip-shield": {
      "type-garment": "icon-clothing-shield",
      "type-heavyarmor": "icon-armor-heavy-shield",
      "type-lightarmor": "icon-armor-light-shield"
    },
    "equip-finger": {
      "type-garment": "icon-armor-circlet"
    },
    "equip-chest": {
      "type-garment": "icon-clothing-body",
      "type-heavyarmor": "icon-armor-heavy-body",
      "type-lightarmor": "icon-armor-light-body"
    },
    "equip-leg": {
      "type-garment": "icon-clothing-pants",
      "type-heavyarmor": "icon-armor-heavy-feet",
      "type-lightarmor": "icon-armor-light-feet"
    }
  }

  iconDict: IconDict = {

    // armors are treated seperately

    "type-armor": "icon-default-armor",
    "type-scroll": "icon-default-scroll",
    "type-food": "icon-default-food",
    "type-ingredient": "icon-default-ingredient",
    "type-misc-key": "icon-default-key",
    "type-potion": "icon-default-potion",
    "type-weapon": "icon-default-weapon",
    "type-food-wine": "icon-food-wine",
    "type-spelltome": "icon-book-tome",
    "type-misc-artifact": "icon-misc-artifact",
    "type-misc-clutter": "icon-misc-clutter",
    "type-misc-dragonclaw": "icon-misc-dragonclaw",
    "type-misc-gem": "icon-misc-gem",
    "type-misc-gold": "icon-misc-gold",
    "type-misc-goldsack": "icon-misc-goldsack",
    "type-misc-hide": "icon-misc-hide",
    "type-misc-ingot": "icon-misc-ingot",
    "type-misc-leather": "icon-misc-leather",
    "type-misc-lockpick": "icon-misc-lockpick",
    "type-misc-ore": "icon-misc-ore",
    "type-misc-remains": "icon-misc-remains",
    "type-misc-soulgem": "icon-misc-soulgem",
    "type-misc-strips": "icon-misc-strips",
    "type-misc-torch": "icon-misc-torch",
    "type-misc-trollskull": "icon-misc-trollskull",
    "type-misc-wood": "icon-misc-wood",
    "type-potion-fire": "icon-potion-fire",
    "type-potion-frost": "icon-potion-frost",
    "type-potion-health": "icon-potion-health",
    "type-potion-magic": "icon-potion-magic",
    "type-potion-poison": "icon-potion-poison",
    "type-potion-shock": "icon-potion-shock",
    "type-potion-stamina": "icon-potion-stam",
    "type-soulgem-azura": "icon-soulgem-azura",
    "type-weapon-arrow": "icon-weapon-arrow",
    "type-weapon-battleaxe": "icon-weapon-battleaxe",
    "type-weapon-bolt": "icon-weapon-bolt",
    "type-weapon-bow": "icon-weapon-bow",
    "type-weapon-crossbow": "icon-weapon-crossbow",
    "type-weapon-dagger": "icon-weapon-dagger",
    "type-weapon-greatsword": "icon-weapon-greatsword",
    "type-weapon-hammer": "icon-weapon-hammer",
    "type-weapon-mace": "icon-weapon-mace",
    "type-weapon-pickaxe": "icon-weapon-pickaxe",
    "type-weapon-staff": "icon-weapon-staff",
    "type-weapon-sword": "icon-weapon-sword",
    "type-weapon-waraxe": "icon-weapon-waraxe",
    "type-weapon-woodaxe": "icon-weapon-woodaxe",

    // book type is polifilled and thus does not exist in database
    "type-book": "icon-default-book",

    // fallback default (e.g. for non-cate misc)
    _default: "icon-default-misc"
  }

  assignIcon = (invItems: InvItem[]) => {

    for (let item of invItems) {

      // if it is an armor, we need to determine it by both equip and type
      if (this.armorTypes.includes(item.type)) {

        // <- (lower priority)

        // face
        if (item.equips.filter(eq => eq.equip === "equip-face").length > 0) {
          item.icon = this.armorEquipDict["equip-face"][item.type];
        }

        // ring
        if (item.equips.filter(eq => eq.equip === "equip-finger").length > 0) {
          item.icon = this.armorEquipDict["equip-finger"][item.type];
        }

        // circlet
        if (item.equips.filter(eq => eq.equip === "equip-neck").length > 0) {
          item.icon = this.armorEquipDict["equip-neck"][item.type];
        }

        // shield
        if (item.equips.filter(eq => eq.equip === "equip-shield").length > 0) {
          item.icon = this.armorEquipDict["equip-shield"][item.type];
        }

        // forearms
        if (item.equips.filter(eq => eq.equip === "equip-forearms").length > 0) {
          item.icon = this.armorEquipDict["equip-forearms"][item.type];
        }

        // leg
        if (item.equips.filter(eq => eq.equip === "equip-leg").length > 0) {
          item.icon = this.armorEquipDict["equip-leg"][item.type];
        }

        // shoes
        if (item.equips.filter(eq => eq.equip === "equip-feet").length > 0) {
          item.icon = this.armorEquipDict["equip-feet"][item.type];
        }

        // helmet
        if (item.equips.filter(eq => eq.equip === "equip-head").length > 0) {
          item.icon = this.armorEquipDict["equip-head"][item.type];
        }

        // (highest priority) base: chest armor 
        if (item.equips.filter(eq => eq.equip === "equip-chest").length > 0) {
          item.icon = this.armorEquipDict["equip-chest"][item.type];
        }

        // fallback to default armor
        if (!item.icon) item.icon = "icon-default-armor";

      } else if (this.iconDict[item.type]) {
        // other items we can determine just by type
        item.icon = this.iconDict[item.type];
      } else {
        item.icon = this.iconDict["_default"];
      }
      
    }
  };

}