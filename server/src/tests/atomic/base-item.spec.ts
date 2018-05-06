import { BaseItemAction as Action } from "../../action/base-item.action";
import { Query } from "../../util";

const action = new Action();

const data = {
  dbname: "item-iron_helmet",
  value: 35,
  weight: 3,
  category: "gears"
}

export const baseItemSpec = describe("Base-item inspections", () => {

  test("(add) Add an iron helmet", async () => {
    let newBaseItem = await action.add(data);
    expect(newBaseItem).toBeTruthy();
  });

  test("(getSingle) Get iron helmet info", async () => {
    let ironhelmet = await action.getSingle("item-iron_helmet");
    if (ironhelmet) {
      expect(ironhelmet[0].weight).toEqual(data.weight);
    } else {
      throw new Error("Failed to retrieve iron helmet data");
    }
  });

  test("(updateSingle) iron helmet is on -75% discount", async () => {
    let updatedBaseItem = await action.updateSingle(
      "item-iron_helmet",
      {
        $mul: {
          value: 0.75
        }
      }
    );
    let ironhelmet = await action.getSingle("item-iron_helmet");

    if (ironhelmet && updatedBaseItem) {
      expect(ironhelmet[0]["effects"] === updatedBaseItem[0]["effects"]);
    } else {
      throw new Error("Failed to make a discount to iron helmet");
    }
  });

  test("(delete) Delete iron helmet", async () => {
    let token = {dbname: 'item-iron_helmet'};
    let delResult = await action.delete(token);
    if (delResult) {
      expect(delResult.n).toBeGreaterThan(0);
    } else {
      throw new Error("Failed to delete iron helmet");
    }

    let result = await action.getSingle(token.dbname);
    if (result) {
      expect(result.length).toBe(0);
    } else {
      throw new Error("Failed to get detail");
    }
    
  });


});