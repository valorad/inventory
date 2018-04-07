import { Query } from "../util";
// import schemas
import { actors } from '../database/schema/actors';
import { DeleteWriteOpResultObject, ObjectId } from 'mongodb';

export const actorSpec = describe("Actor inspections", () => {

  test("add an actor", async () => {

    let info = {
      dbname: "olaf",
      icon: ""
    }

    let newActor = await Query.addRecord(
      actors,
      info,
      ["dbname", "icon", "equiped"],
      (actorToSave: any) => {

        if (!actorToSave.equiped) {
          actorToSave.equiped = {};
        }

        for (let key in actorToSave.equiped) {

          if (typeof actorToSave.equiped[key] === 'string') {

            try {

              actorToSave.equiped[key] = new ObjectId(actorToSave.equiped[key]);

            } catch (error) {
              console.error(`Error: ObjectID Conversion Failure at ${actorToSave.dbname}'s equiped ${key}: ${error.message}`);
              actorToSave.equiped[key] = null;
            }
            
          } else if (!(actorToSave.equiped[key] instanceof ObjectId)) {
            actorToSave.equiped[key] = null;
          }

        } // <- for

      }


    );

    expect(newActor).toBeTruthy();

  });

  test("get Actor list", async () => {
    let result = await Query.getList(actors);
    if (result) {
      expect(result.length).toBeGreaterThan(0);
    } else {
      throw "failed to get list";
    }
    
  });

  test("delete an actor", async () => {
    let token = {dbname: 'olaf'};
    let delResult: DeleteWriteOpResultObject["result"] = await Query.deleteRecord(actors, token);
    expect(delResult.n).toBeGreaterThan(0);
    let result = await Query.getDetail(actors, token);
    if (result) {
      expect(result.length).toBe(0);
    } else {
      throw "failed to get detail";
    }
    
  });


});