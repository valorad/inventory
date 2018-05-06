import { RefItemAction as Action } from "../../action/ref-item.action";

const action = new Action();

const data = [
  {
    item: 'item_iron-helmet',
    owner: 'olaf'
  },
  {
    item: 'item_iron-helmet',
    owner: 'geralt'
  },
  {
    item: 'item_ammo-dot308',
    owner: 'josh',
    num: 100
  },
  {
    item: 'item_mountain-flower',
    owner: 'amily',
    num: 10
  },
  {
    item: 'item_daedra-heart',
    owner: 'josh'
  }

];

let lastId: any;

export const refItemSpec = describe("ref-item inspections", () => {

  test("add ref items", async () => {

    let newRefItem: any;

    for (let datium of data) {
      newRefItem = await action.add(datium);
      expect(newRefItem).toBeTruthy();
    }

    lastId = newRefItem._id;

  });

  test("get ref-item List", async () => {
    let refItems = await action.getList();
    expect(refItems.length).toEqual(5);
  });

  test("get to know who owns 'iron-helmet'", async () => {
    let item = "item_iron-helmet";
    let refList = await action.getList({ item });
    expect(refList.length).toEqual(2);
  });

  test("get list of items owned by josh", async () => {
    let owner = "josh";
    let refList = await action.getList({ owner });
    expect(refList.length).toEqual(2);
  });

  test("get detail providing _id", async () => {
    let _id = lastId;
    let refItem = await action.getSingle(_id);
    if (refItem) {
      expect(refItem[0].item).toBe("item_daedra-heart");
    } else {
      throw new Error("Error finding item");
    }
  });

  test("transfer refitem of provided _id to Geralt", async () => {
    let _id = lastId;
    let transferedItem = await action.updateSingle(_id, {owner: 'geralt'});
    let lastItem = await action.getSingle(_id);
    if (transferedItem && lastItem) {
      expect(lastItem[0].owner === transferedItem[0].owner);
    } else {
      throw new Error("Failed to transfer ownership");
    }
  });

  test("delete item providing _id", async () => {
    let _id = lastId;
    let delResult = await action.delete({_id});
    if (delResult) {
      expect(delResult.n).toEqual(1);
    } else {
      throw new Error("Error deleting item");
    }
    
  });




});