import { ConsumableAction as Action } from "../action/consumable.action";
import { Query } from "../util";

const action = new Action();

const data = {
  dbname: "item-food_apple",
  type: "food",
  effects: [
    "effect-restore_health"
  ]
}

export const consumableSpec = describe("Consumable inspections", () => {

  test("(add) Add an apple", async () => {
    let newConsumable = await action.add(data);
    expect(newConsumable).toBeTruthy();
  });

  test("(getSingle) Get apple info", async () => {
    let apple = await action.getSingle("item-food_apple");
    if (apple) {
      expect(apple[0].type).toEqual(data.type);
    } else {
      throw new Error("Failed to retrieve apple data");
    }
  });

  test("(updateSingle) Make apple poisonous (hypothetically)", async () => {
    let updatedConsumable = await action.updateSingle(
      "item-food_apple",
      {
        $pull: {
          effects: "effect-restore_health"
        }
      }
    );

    updatedConsumable = await action.updateSingle(
      "item-food_apple",
      {
        $push: {
          effects: "effect_damage_health"
        }
      }
    );

    let apple = await action.getSingle("item-food_apple");

    if (apple && updatedConsumable) {
      expect(apple[0].effects === updatedConsumable[0].effects);
    } else {
      throw new Error("Failed to poison apple");
    }
  });

  test("(delete) Delete apple", async () => {
    let token = {dbname: 'item-food_apple'};
    let delResult = await action.delete(token);
    if (delResult) {
      expect(delResult.n).toBeGreaterThan(0);
    } else {
      throw new Error("Failed to delete apple");
    }

    let result = await action.getSingle(token.dbname);
    if (result) {
      expect(result.length).toBe(0);
    } else {
      throw new Error("Failed to get detail");
    }
    
  });


});
