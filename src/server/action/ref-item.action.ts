
import { DeleteWriteOpResultObject } from 'mongodb';

import { Query } from "../util/query";
// import schemas
import { refItems } from '../database/schema/ref-items';

export class RefItemAction {

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

  getSingle = async (_id: string) => {
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

  delete = async (token: any) => {

    let delResult: DeleteWriteOpResultObject["result"] = await Query.deleteRecord(refItems, token);
    return delResult;

  };



  
}