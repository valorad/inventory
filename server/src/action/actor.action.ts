import { Query } from "../util/query";
import { IAction } from "./interface/action.interface";
// import schemas
import { actors } from '../database/schema/actors';
import { ObjectId } from "mongodb";

export class ActorAction implements IAction {

  fields = ["dbname", "icon", "equiped"];

  getAll = async () => {
    return await Query.getList(actors);
  };

  getList = async(conditions: any = {}, page?: number) => {
    let result = await Query.getList(
      actors,
      {
        conditions,
        page,
        perPage: 10
      }
    );
    return result;
  };

  getSingle = async (dbname: string = "") => {
    return await Query.getDetail(actors, {dbname});
  };

  add = async (info: any) => {

    let newActor = await Query.addRecord(
      actors,
      info,
      this.fields,
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

  update = async (conditions: any, token: any) => {
    return await Query.setRecord(actors, conditions, token, {updateAll: true});
  };

  updateSingle = async (dbname: string, token: any) => {
    let updatedActor = await Query.setRecord(actors, {dbname}, token);
    return updatedActor;
  };

  delete = async (token: any) => {

    let delResult = await Query.deleteRecord(actors, token);
    return delResult;

  };

  isEquiping = async (actorName: string, invItemID: ObjectId, equiptTo?: string) => {
    let actors = await this.getSingle(actorName);
    if (actors) {
      let actor = actors[0];

      if (equiptTo) {

        if (actor.equiped[equiptTo]) {
          return actor.equiped[equiptTo] === invItemID;
        } else {
          return null;
        }

      } else {
        for (let key in actor.equiped) {
          if (actor.equiped[key] === invItemID) {
            return true;
          }
        }
        return false;
      }
    }
    return null;
  };

  equip = async (actorName: string, invItem: ObjectId | string, equiptTo: string[]) => {
    let invItemIDObj = Query.toObjID(invItem);
    if (invItemIDObj) {
      let actors = await this.getSingle(actorName);
      if (actors && actors[0]) {
        let actor = actors[0];
        for (let pos of equiptTo) {
          actor.equiped[pos] = invItemIDObj;
        }
        return actor.equiped;
      }
    }

    return {};
  };

  unequipFrom = async (actorName: string, equiptTo?: string[]) => {
    let actors = this.getSingle(actorName);
    if (actors) {
      let actor = actors[0];

      if (equiptTo) {
        for (let pos of equiptTo) {
          delete actor.equiped[pos];
        }    
      }
      
      return actor.equiped;
    }
    return {};
  };

  unequip = async (actorName: string, invItem: ObjectId | string) => {
    let invItemIDObj = Query.toObjID(invItem);

    if (invItemIDObj) {
      let actors = await this.getSingle(actorName);
      if (actors && actors[0]) {
        let actor = actors[0];
        for (let key in actor.equiped) {
          if (actor.equiped[key] === invItemIDObj) {
            delete actor.equiped[key];
            return actor.equiped;
          }
        }
      }
    }
    return null;
  };

}