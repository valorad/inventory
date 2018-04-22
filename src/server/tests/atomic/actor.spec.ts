import { ActorAction as Action } from "../../action/actor.action";

const action = new Action();

export const actorSpec = describe("Actor inspections", () => {

  test("add an actor olaf", async () => {

    let info = {
      dbname: "olaf",
      icon: ""
    }

    let newActor = await action.add(info);

    expect(newActor).toBeTruthy();

  });

  test("get Actor list", async () => {
    let result = await action.getAll();
    if (result) {
      expect(result.length).toBeGreaterThan(0);
    } else {
      throw new Error("failed to get list");
    }
    
  });

  test("update olaf's icon", async () => {
    let updatedActor = await action.updateSingle("olaf", {icon: "olaf.png"});
    let olaf = await action.getSingle("olaf");
    if (olaf && updatedActor) {
      expect(olaf[0].icon === updatedActor[0].icon);
    } else {
      throw new Error("Failed to update or find actor olaf");
    }
    
  });

  test("delete actor olaf", async () => {
    let token = {dbname: 'olaf'};
    let delResult = await action.delete(token);
    if (delResult) {
      expect(delResult.n).toBeGreaterThan(0);
    } else {
      throw new Error("failed to delete actor");
    }

    let result = await action.getSingle(token.dbname);
    if (result) {
      expect(result.length).toBe(0);
    } else {
      throw new Error("failed to get detail");
    }
    
  });


});