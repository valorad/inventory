import { Query } from "../util/query";
import { IAction } from "./interface/action.interface";
// import schemas
import { actors } from '../database/schema/actors';

export class ActorAction implements IAction {

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

          actorToSave.equiped[key] = Query.toObjID(actorToSave.equiped[key]);

        } // <- for

      }

    );

    return newActor;

  };

  updateSingle = async (dbname: string, token: any) => {
    let updatedActor = await Query.setRecord(actors, {dbname}, token);
    return updatedActor;
  };

  delete = async (token: any) => {

    let delResult = await Query.deleteRecord(actors, token);
    return delResult;

  };

}