import { Query } from "../util/query";
import { IAction } from "./interface/action.interface";
// import schemas
import { refItems } from '../database/schema/ref-items';

export class RefItemAction implements IAction {

  getAll = async () => {
    return await Query.getList(refItems);
  };

  getList = async(conditions: any = {}, page?: number) => {
    let result = await Query.getList(
      refItems,
      {
        conditions,
        page,
        perPage: 10
      }
    );
    return result;
  };

  getSingle = async (_id: string = "") => {
    let queryObjID = Query.toObjID(_id);
    return await Query.getDetail(refItems, {_id: queryObjID});
  };

  add = async (info: any) => {
    let newRefItem = await Query.addRecord(
      refItems,
      info,
      ["item", "owner"]
    );
    return newRefItem;
  };

  updateSingle = async (_id: string, token: any) => {
    let queryObjID = Query.toObjID(_id);
    return await Query.setRecord(refItems, {_id: queryObjID}, token);
  };

  delete = async (token: any) => {

    let delResult = await Query.deleteRecord(refItems, token);
    return delResult;

  };



  
}