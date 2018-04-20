import { DataBase } from "../database";
import { connection, Mongoose } from 'mongoose';

// actions
import { ActorAction } from "../action/actor.action";
import { TranslationAction } from "../action/translation.action";
import { Action as BaseItemGraphAction } from "../graph/base-item/action";
import { Action as InvGraphAction } from "../graph/inventory/action"

process.env.isTesting = 'yes';

let mongoInstance: Mongoose | null;

beforeAll(async () => {
  let db = new DataBase();
  mongoInstance = await db.connect();
});

describe("inventory test", () => {

  const menuTranslation = [
    {
      dbname: "type-lightarmor",
      name: {
        en: "Light Armor",
        zh: "轻甲"
      }
    },
    {
      dbname: "type-grenade",
      name: {
        en: "Grenade",
        zh: "手榴弹"
      }
    },
    {
      dbname: "equip-body",
      name: {
        en: "body",
        zh: "身体"
      }
    },
    {
      dbname: "effect-increse_intelligence",
      name: {
        en: "Increase intelligence",
        zh: "提升智力"
      }
    }
  ];

  const actor = {
    dbname: "cortana"
  }

  const baseItemSample = {
    book: {
      dbname: "item-darkbro_tenant",
      value: 10,
      weight: 1,
      category: "books",
      detail: {
        content: "Dark-bro rules: 1. No black sacrament on kittens. 2. No D.."
      }
    },
    gear: {
      dbname: "item-edi_body",
      value: 2000,
      weight: 5,
      category: "gears",
      detail: {
        type: "type-lightarmor",
        rating: 50,
        equip: "equip-body",
        effects: [
          "effect-increse_intelligence"
        ]
      },
      translations: {
        name: {
          en: "EDI's body",
          zh: "EDI 的护甲"
        }
      }
    },
    consumable: {
      dbname: "item-titanV",
      value: 10000,
      weight: 3,
      category: "consumables",
      detail: {
        type: "type-grenade",
        effects: []
      }
    }
  };

  const actorAction = new ActorAction();
  const translationAction = new TranslationAction();
  const baseItemGraphAction = new BaseItemGraphAction();
  const invGraphAction = new InvGraphAction();

  // import menu translations
  test("Import menu translations", async () => {
    for (let trans of menuTranslation) {
      let newTrans = await translationAction.add(trans);
    }
    let transList = await translationAction.getList();
    expect(transList.length).toEqual(4);
  });

  // create an actor
  test("Create Cortana", () => {
    
    let cortana = actorAction.add(actor);
    expect(cortana).toBeTruthy();
  });

  // create base-items - a book, a gear and a consumable
  describe("Create base-items", () => {
    

    test("create a dark-brotherhood tenant", async () => {
      let item = await baseItemGraphAction.add(baseItemSample.book);
      expect(item).toBeTruthy();
    });

    test("create edi's chest armor", async () => {
      let item = await baseItemGraphAction.add(baseItemSample.gear);
      expect(item).toBeTruthy();
    });

    test("create a nuke grenade of Nvidia TitanV", async () => {
      let item = await baseItemGraphAction.add(baseItemSample.consumable);
      expect(item).toBeTruthy();
    });

  });

  // add a gear to actor's inventory (create corresponding ref-items)
  // actor equips that gear
  test("Add edi's chest armor to Cortana's inventory, then Cortana wears it", async () => {
    let newInv = await invGraphAction.gift("item-edi_body", "cortana");
    expect(newInv).toBeTruthy();
    let newInvVerbose = await invGraphAction.getList({holder: "cortana", item: newInv.item});
    if (newInvVerbose[0]) {
      let itembase: any = newInvVerbose[0].item.base;
      let equip = itembase.detail.equip;

      let eResult = actorAction.equip("cortana", newInv._id, equip);
      expect(eResult).toBeTruthy();
    } else {
      throw new Error("Failed to fetch detailed info of the inv-item");
    }
    
  });

  // query actor inventory info, should contain the item just added:
  // (query item base info from invAction)
  test("Make sure edi's armor is in Cortana's bag, and not altered", async () => {
    let invItems = await invGraphAction.getList({holder: "cortana"}, undefined, "zh");
    if (invItems) {
      let armor = invItems[0]; // we know it's on position 0 because we only gave her 1 armor.
      let itembase: any = armor.item.base || {};
      let itemtype = itembase.detail.type;
      expect(itemtype).toBe(baseItemSample.gear.detail.type);
      // test menu translation
      let itemtypeName = itembase.detail.typeName;
      expect(itemtypeName).toBe(menuTranslation[0].name.zh);
      // test item detail translation
      expect(itembase.name).toBe(baseItemSample.gear.translations.name.zh);
      
    } else {
      throw new Error("Cannot find Cortana's inventory");
    }

  });

  // delete the gear inv-item, actor's equiped gear should auto-unequip
  // then actor's inventory should be empty
  test("Remove the armor Cortana just received", async () => {
    let rmInvItem = await invGraphAction.remove("item-edi_body", "cortana");
    expect(rmInvItem).toBeTruthy();
    
    expect(await actorAction.isEquiping("cortana", rmInvItem)).toBeFalsy();

    let invItems = await invGraphAction.getList({holder: "cortana"});
    expect(invItems.length).toBeLessThanOrEqual(0);
  });

  // delete all base-items created
  test("Remove all base-items created", async () => {

    let results: any[] = [];
    
    results.push(await baseItemGraphAction.delete({dbname: "item-darkbro_tenant"}));
    results.push(await baseItemGraphAction.delete({dbname: "item-edi_body"}));
    results.push(await baseItemGraphAction.delete({dbname: "item-titanV"}));

    for (let result of results) {
      expect(result.rmCount).toEqual(1);
      return;
    }

    throw new Error("Del result push failure");

  });

  // delete the actor
  test("Remove actor Cortana", async () => {

    let token = {dbname: actor.dbname};
    let delResult = await actorAction.delete(token);
    if (delResult) {
      expect(delResult.n).toBeGreaterThan(0);
    } else {
      throw new Error("failed to delete actor cortana");
    }

    let result = await actorAction.getSingle(token.dbname);
    if (result) {
      expect(result.length).toBe(0);
    } else {
      throw new Error("failed to get detail");
    }

  });

  // delete menu translations
  test("Delete all translations", async () => {
    let delResult = await translationAction.delete({});
    if (delResult) {
      expect(delResult.n).toBeGreaterThanOrEqual(4);
    } else {
      throw new Error("Failed to delete menu translations");
    }
  });

});


afterAll(async () => {
  if (mongoInstance) {
    await mongoInstance.connection.dropDatabase();
  }
});