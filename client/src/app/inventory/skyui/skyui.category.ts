import { InvItem } from "src/app/_interfaces/invItem.i";

interface CategoryDict {
  [index: string]: string;
}

export class SkyUICategory {

  dict: CategoryDict = {

    "type-armor": "category-apparel",
    "type-garment": "category-apparel",
    "type-lightarmor": "category-apparel",
    "type-heavyarmor": "category-apparel",

    "type-weapon": "category-weapons",
    "type-weapon-arrow": "category-weapons",
    "type-weapon-battleaxe": "category-weapons",
    "type-weapon-bolt": "category-weapons",
    "type-weapon-bow": "category-weapons",
    "type-weapon-crossbow": "category-weapons",
    "type-weapon-dagger": "category-weapons",
    "type-weapon-greatsword": "category-weapons",
    "type-weapon-hammer": "category-weapons",
    "type-weapon-mace": "category-weapons",
    "type-weapon-pickaxe": "category-weapons",
    "type-weapon-staff": "category-weapons",
    "type-weapon-sword": "category-weapons",
    "type-weapon-waraxe": "category-weapons",
    "type-weapon-woodaxe": "category-weapons",

    "type-potion": "category-potions",
    "type-potion-fire": "category-potions",
    "type-potion-frost": "category-potions",
    "type-potion-health": "category-potions",
    "type-potion-magic": "category-potions",
    "type-potion-poison": "category-potions",
    "type-potion-shock": "category-potions",
    "type-potion-stamina": "category-potions",

    "type-scroll": "category-scrolls",

    "type-food": "category-food",
    "type-food-wine": "category-food",

    "type-ingredient": "category-ingredients",

    "type-book": "category-books", // polyfilled type which does not exist on database

    "type-misc-key": "category-keys",

    _default: "category-misc"    // --> "category-misc" acts as a fallback

  }

  assignCategory = (invItems: InvItem[]) => {

    for (let item of invItems) {

      if (item.type && this.dict[item.type]) {
        item.category = this.dict[item.type]
      } else {
        item.category = this.dict["_default"]
      }

      
    }

  };


  
}