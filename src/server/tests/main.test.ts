import { DataBase } from "../database";
import { connection, Mongoose } from 'mongoose';

// actions
import { ActorAction } from "../action/actor.action";
import { TranslationAction } from "../action/translation.action";
import { Action as ActorGraphAction } from "../graph/actor/action"
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
    dbname: "actor-cortana",
    translations: {
      name: {
        en: "Cortana",
        zh: "小娜"
      }
    }
  }

  const baseItemSample = {
    book: {
      dbname: "item-darkbro_tenant",
      value: 10,
      weight: 1,
      category: "books",
      detail: {
        content: "content-darkbro_tenant"
      },
      translations: {
        name: {
          en: "Dark Brotherhood tenant",
          zh: "黑暗兄弟会教义"
        },
        bookContent: {
          en: "Dark-bro rules: 1. No black sacrament on kittens. 2. No D..",
          zh: "黑兄规矩： 1. 不准在喵喵身上执行黑暗仪式 2.没有得到.."
        }
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
  const actorGraphAction = new ActorGraphAction();

  // import menu translations
  test(
    "Import menu translations",
    async () => {
      for (let trans of menuTranslation) {
        let newTrans = await translationAction.add(trans);
      }
      let transList = await translationAction.getList();
      expect(transList.length).toBeGreaterThanOrEqual(4);
    },
    1*60*1000
  );

  // create an actor
  test("Create Cortana", async () => {
    let addResult = await actorGraphAction.add(actor);
    let queryActor = await actorGraphAction.getSingle("actor-cortana", "zh");
    expect(queryActor.name).toBe(actor.translations.name.zh);
  });

  // create base-items - a book, a gear and a consumable
  describe("Create base-items", () => {
    
    test("create a dark-brotherhood tenant", async () => {
      let addResult = await baseItemGraphAction.add(baseItemSample.book);
      
      // Test book i18n
      let queryItem = await baseItemGraphAction.getSingle(baseItemSample.book.dbname);

      expect(queryItem.detail["contentDetail"]).toBe(baseItemSample.book.translations.bookContent.en);

    });

    test("create edi's chest armor", async () => {
      let addResult = await baseItemGraphAction.add(baseItemSample.gear);
      expect(addResult.newBaseItem).toBeTruthy();
      expect(addResult.newDetail).toBeTruthy();
    });

    test("create a nuke grenade of Nvidia TitanV", async () => {
      let addResult = await baseItemGraphAction.add(baseItemSample.consumable);
      expect(addResult.newBaseItem).toBeTruthy();
      expect(addResult.newDetail).toBeTruthy();
    });

  });

  // add a gear to actor's inventory (create corresponding ref-items)
  // actor equips that gear
  test("Add edi's chest armor to Cortana's inventory, then Cortana wears it", async () => {
    let newInv = await invGraphAction.gift("item-edi_body", "actor-cortana");
    expect(newInv).toBeTruthy();
    let newInvVerbose = await invGraphAction.getSingle(newInv.item, "actor-cortana");

    let itembase = newInvVerbose.base;
    if (itembase && itembase.detail && itembase.detail.equip) {
      let equip = itembase.detail.equip;
      let eResult = actorAction.equip("actor-cortana", newInv["_id"], equip);
      expect(eResult).toBeTruthy();
    } else {
      throw new Error("base-item detail structure error");
    }

  });

  // add more than 1 consumables, with multiple refs
  test("Add item - Titan V * 2, three times", async () => {
    let refsLength = 3;
    for (let i = 0; i < refsLength; i++) {
      await invGraphAction.gift("item-titanV", "actor-cortana", 2);
    }

    let invList = await invGraphAction.getList({item: "item-titanV", holder: "actor-cortana"});

    if (invList.length > 0) {
      expect(invList[0].refDetails.length).toEqual(3);
    } else {
      throw new Error("Cannot find titanV just given to Cortana");
    }

  });

  // query actor inventory info, should contain the item just added:
  // (query item base info from invAction)
  test("Make sure edi's armor is in Cortana's bag, and not altered", async () => {

    let armor = await invGraphAction.getSingle("item-edi_body", "actor-cortana", "zh");
    if (armor.base && armor.base.detail) {
      expect(armor.base.detail.type).toBe(baseItemSample.gear.detail.type);
      // test menu translation
      let itemtypeName = armor.base.detail["typeName"];
      expect(itemtypeName).toBe(menuTranslation[0].name.zh);
      // test item detail translation
      expect(armor.base["name"]).toBe(baseItemSample.gear.translations.name.zh);

    } else {
      throw new Error("Cannot find Cortana's inventory, or data structure mismatch");
    }
    
  });

  // delete the gear inv-item, actor's equiped gear should auto-unequip
  // then actor's inventory should be empty
  test("Remove the armor Cortana just received", async () => {
    let rmResult = await invGraphAction.remove("item-edi_body", "actor-cortana");
    if (rmResult) {
      expect(rmResult.rmRefCount).toEqual(1);
    } else {
      throw new Error("Failed to fetch ref item list");
    }
  });

  test("Cortana just throwed 5 titanVs away!", async () => {
    let rmResult = await invGraphAction.remove("item-titanV", "actor-cortana", 5);
    if (rmResult) {
      expect(rmResult.rmRefCount).toEqual(2);
      expect(rmResult.rmInvCount).toEqual(0);
    } else {
      throw new Error("Failed to remove item");
    }

    // then should have only 1 Titan V in inventory
    let titanV = await invGraphAction.getSingle("item-titanV", "actor-cortana");
    if (titanV.refDetails && titanV.refDetails.length > 0) {
      expect(titanV.refDetails[0].num).toEqual(1);
    } else {
      throw new Error("Cannot find a titanV");
    }
    
  });

  // delete all base-items created
  test("Remove all base-items created", async () => {

    let results: any[] = [];
    
    results.push(await baseItemGraphAction.delete({dbname: "item-darkbro_tenant"}));
    results.push(await baseItemGraphAction.delete({dbname: "item-edi_body"}));
    results.push(await baseItemGraphAction.delete({dbname: "item-titanV"}));

    for (let result of results) {

      expect(result.baseDelResult.n).toEqual(1);
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