import { Query } from "../util/query";
import { IAction } from "./interface/action.interface";
// import schemas
import { gears } from '../database/schema/gears';

export class GearAction implements IAction {
  
  getList = async (conditions: any = {}, page?: number) => {
    let result = await Query.getList(
      gears,
      {
        conditions,
        page,
        perPage: 10
      }
    );
    return result;
  };

  getSingle = async (dbname: string = "") => {
    return await Query.getDetail(gears, {dbname});
  };

  add = async (info: any) => {
    let newGear = await Query.addRecord(
      gears,
      info,
      ["dbname", "rating", "type", "equip", "effects"]
    );
    return newGear;
  };

  updateSingle = async (dbname: string, token: any) => {
    return await Query.setRecord(gears, {dbname}, token);
  };

  delete = async (token: any) => {

    let delResult = await Query.deleteRecord(gears, token);
    return delResult;

  };

}