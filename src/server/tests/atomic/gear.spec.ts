import { GearAction as Action } from "../../action/gear.action";
import { Query } from "../../util";

const action = new Action();

const data = {
  dbname: "item-weapon-crossbow",
  rating: 35,
  type: "crossbow",
  equip: "bothhands"
}

export const gearSpec = describe("Gear inspections", () => {

  test("(add) Add a crossbow", async () => {
    let newGear = await action.add(data);
    expect(newGear).toBeTruthy();
  });

  test("(getSingle) Get crossbow info", async () => {
    let crossbow = await action.getSingle("item-weapon-crossbow");
    if (crossbow) {
      expect(crossbow[0].rating).toEqual(data.rating);
    } else {
      throw new Error("Failed to retrieve crossbow data");
    }
  });

  test("(updateSingle) Enchant the crossbow with soul trap", async () => {
    let updatedGear = await action.updateSingle(
      "item-weapon-crossbow",
      {
        $push: {
          effects: "effect_soul_trap"
        }
      }
    );
    let crossbow = await action.getSingle("item-weapon-crossbow");

    if (crossbow && updatedGear) {
      expect(crossbow[0].effects === updatedGear[0].effects);
    } else {
      throw new Error("Failed to enchant crossbow with soul trap");
    }
  });

  test("(delete) delete crossbow", async () => {
    let token = {dbname: 'item-weapon-crossbow'};
    let delResult = await action.delete(token);
    if (delResult) {
      expect(delResult.n).toBeGreaterThan(0);
    } else {
      throw new Error("Failed to delete crossbow");
    }

    let result = await action.getSingle(token.dbname);
    if (result) {
      expect(result.length).toBe(0);
    } else {
      throw new Error("Failed to get detail");
    }
    
  });


});
