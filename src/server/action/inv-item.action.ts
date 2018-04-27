import { IAction } from "./interface/action.interface";
import { Query } from "../util/query";
// import schemas
import { invItems } from '../database/schema/inv-items';

export class InvItemAction implements IAction {

  fields: string[] = ["item", "holder", "refs"];

  getAll = async () => {
    return await Query.getList(invItems);
  };

  getList = async(conditions: any = {}, page?: number) => {
    let result = await Query.getList(
      invItems,
      {
        conditions,
        page,
        perPage: 10
      }
    );
    return result;
  };

  getSingle = async (_id: string = "") => {
    return await Query.getDetail(invItems, {_id});
  };

  add = async (info: any) => {
    let newInventoryItem = await Query.addRecord(
      invItems,
      info,
      this.fields
    );
    return newInventoryItem;
  };

  updateSingle = async (_id: string, token: any) => {
    let queryObjID = Query.toObjID(_id);
    return await Query.setRecord(invItems, {_id: queryObjID}, token);
  };

  update = async (conditions: any, token: any) => {
    return await Query.setRecord(invItems, conditions, token, {updateAll: true});
  };

  delete = async (token: any) => {

    let delResult = await Query.deleteRecord(invItems, token);
    return delResult;

  };



}