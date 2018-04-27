import { Query } from "../util/query";
import { IAction } from "./interface/action.interface";
// import schemas
import { consumables } from '../database/schema/consumables';

export class ConsumableAction implements IAction {

  fields = ["dbname", "type", "effects"];

  getAll = async () => {
    return await Query.getList(consumables);
  };
  
  getList = async (conditions: any = {}, page?: number) => {
    let result = await Query.getList(
      consumables,
      {
        conditions,
        page,
        perPage: 10
      }
    );
    return result;
  };

  getSingle = async (dbname: string = "") => {
    return await Query.getDetail(consumables, {dbname});
  };

  add = async (info: any) => {
    let newConsumable = await Query.addRecord(
      consumables,
      info,
      this.fields
    );
    return newConsumable;
  };

  update = async (conditions: any, token: any) => {
    return await Query.setRecord(consumables, conditions, token, {updateAll: true});
  };

  updateSingle = async (dbname: string, token: any) => {
    return await Query.setRecord(consumables, {dbname}, token);
  };

  delete = async (token: any) => {

    let delResult = await Query.deleteRecord(consumables, token);
    return delResult;

  };

}