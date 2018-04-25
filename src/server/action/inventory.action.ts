import { IAction } from "./interface/action.interface";
import { Query } from "../util/query";
// import schemas
import { inventories } from '../database/schema/inventories';

export class InventoryAction implements IAction {

  fields: string[] = ["item", "holder", "refs"];

  getAll = async () => {
    return await Query.getList(inventories);
  };

  getList = async(conditions: any = {}, page?: number) => {
    let result = await Query.getList(
      inventories,
      {
        conditions,
        page,
        perPage: 10
      }
    );
    return result;
  };

  getSingle = async (_id: string = "") => {
    return await Query.getDetail(inventories, {_id});
  };

  add = async (info: any) => {
    let newInventoryItem = await Query.addRecord(
      inventories,
      info,
      this.fields
    );
    return newInventoryItem;
  };

  updateSingle = async (_id: string, token: any) => {
    let queryObjID = Query.toObjID(_id);
    return await Query.setRecord(inventories, {_id: queryObjID}, token);
  };

  updateSingleByConditions = async (conditions: any, token: any) => {
    return await Query.setRecord(inventories, conditions, token);
  };

  delete = async (token: any) => {

    let delResult = await Query.deleteRecord(inventories, token);
    return delResult;

  };



}