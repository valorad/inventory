import { InventoryAction as Action } from "../action/inventory.action";
import { Query } from "../util";

const action = new Action();

const data = [
  // item is storing a field that is to be conerted to objectId
  // it has to be a 12- or 24-character string
  // in pratice, it may not necessarily be like this
  {
    item: "greedisgood!",
    holder: "dogmeat"
  },
  {
    item: "basebelongus",
    holder: "jessica"
  },
  {
    item: "tucktucktuck",
    holder: "dogmeat"
  },
  {
    item: "robin___hood",
    holder: "triss"
  },
  {
    item: "tucktucktuck",
    holder: "nvidia"
  }
];

export const inventorySpec = describe("Inventory inspections", () => {

  test("(add) Add data to inventory", async () => {

    let newInvItem: any;

    for (let datium of data) {
      newInvItem = await action.add(datium);
      expect(newInvItem).toBeTruthy();
    }

  });

  test.skip("(getList) Get Dogmeat's inventory", async () => {

    let dogmeatBag = await action.getList({holder: 'dogmeat'});
    if (dogmeatBag) {
      expect(dogmeatBag.length).toEqual(2);
    } else {
      throw new Error("Failed to search Dogmeat's bag");
    }

  });

  test.skip("(getSingle) Get detail of an invItem in nvidia's bag with _id", async () => {

    let holder = "nvidia";
    let invItem = await action.getList({
      holder
    });
    if (invItem) {
      expect(invItem[0].holder).toBe("nvidia");
    } else {
      throw new Error("Error finding item");
    }
  });

  test("(updateSingleByConditions) Triss's 'robin___hood' is stolen and 洗白ed by Jessica", async () => {
    let item = Query.toObjID('robin___hood');
    let transferedItem = await action.updateSingleByConditions(
      {
        item: item,
        holder: "triss"
      },
      {holder: 'jessica'}
    );
    if (transferedItem) {    
      let _id = transferedItem[0]._id;
      let robin___hood = await action.getSingle(_id);
      if (robin___hood) {
        expect(robin___hood[0].owner === transferedItem[0].owner);
        return;
      }
    }

    throw new Error("Failed to transfer ownership");
    

  });

  test.skip("(delete) Dogmeat's Arrow ammo out", async () => {
    let item = "tucktucktuck";
    let holder = "dogmeat";
    let delResult = await action.delete({
      item,
      holder
    });
    if (delResult) {
      expect(delResult.n).toEqual(1);
    } else {
      throw new Error("Error deleting item");
    }
    
  });

});