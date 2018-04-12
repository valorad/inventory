import { Query } from "../util/query";
import { IAction } from "./interface/action.interface";
// import schemas
import { baseItems } from '../database/schema/base-items';

export class BaseItemAction implements IAction {

  getAll = async () => {
    return await Query.getList(baseItems);
  };

  getList = async(conditions: any = {}, page?: number) => {
    let result = await Query.getList(
      baseItems,
      {
        conditions,
        page,
        perPage: 10
      }
    );
    return result;
  };

  getSingle = async (dbname: string = "") => {
    return await Query.getDetail(baseItems, {dbname});
  };

  add = async (info: any) => {
    let newBaseItem = await Query.addRecord(
      baseItems,
      info,
      ["dbname", "value", "weight", "category"]
    );
    return newBaseItem;
  };

  updateSingle = async (dbname: string, token: any) => {
    let updatedBaseItem = await Query.setRecord(baseItems, {dbname}, token);
    return updatedBaseItem;
  };

  delete = async (token: any) => {

    let delResult = await Query.deleteRecord(baseItems, token);
    return delResult;

  };

}