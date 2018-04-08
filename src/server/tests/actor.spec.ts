import { ActorAction as Action } from "../action/actor.action";

const action = new Action();

export const actorSpec = describe("Actor inspections", () => {

  test("add an actor", async () => {

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
      throw "failed to get list";
    }
    
  });

  test("delete an actor", async () => {
    let token = {dbname: 'olaf'};
    let delResult = await action.delete(token);
    expect(delResult.n).toBeGreaterThan(0);
    let result = await action.getSingle(token.dbname);
    if (result) {
      expect(result.length).toBe(0);
    } else {
      throw "failed to get detail";
    }
    
  });


});