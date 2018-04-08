import { DeleteWriteOpResultObject, ObjectId } from 'mongodb';

import { Query } from "../util/query";
// import schemas
import { actors } from '../database/schema/actors';

export class ActorAction {

  getAll = async () => {
    return await Query.getList(actors);
  };

  getSingle = async (dbname: string = "") => {
    return await Query.getDetail(actors, {dbname});
  };

  add = async (info: any) => {

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
            actorToSave.equiped[key] = Query.convertObjID(actorToSave.equiped[key]);
          } else if (!(actorToSave.equiped[key] instanceof ObjectId)) {
            actorToSave.equiped[key] = null;
          }

        } // <- for

      }

    );

    return newActor;

  };

  delete = async (token: any) => {

    let delResult: DeleteWriteOpResultObject["result"] = await Query.deleteRecord(actors, token);
    return delResult;

  };

}