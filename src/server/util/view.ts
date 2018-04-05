import { Model } from "mongoose";

interface IMQuery {
  conditions?: any,
  includes?: string[],
  excludes?: string[],
  page?: number,
  perPage?: number,
  orderBy?: string,
  order?: "asc" | "desc"
}

export class View {

  static getList = async (collection: Model<any>, query: IMQuery = {}) => {

    let conditions = query.conditions || {};

    let projections = {};

    // set fields to show
    for (let field of query.includes || []) {
      projections[field] = 1;
    }

    // set fields to hide
    for (let field of query.excludes || []) {
      projections[field] = -1;
    }

    let options = {};

    // set paginations
    if (query.page) {
      let limit = query.perPage || 10;
      let offset = (query.page - 1) * limit;
      options["skip"] = offset;
      options["limit"] = limit;
    }

    // set orderBy
    let sort = {};

    if (query.orderBy) {
      if (query.order === "desc") {
        sort[query.orderBy] = -1;
      } else {
        // default displayed ascended
        sort[query.orderBy] = 1;
      }
      
    }

    let result = await collection.find(conditions, projections, options).sort(sort);
    return result;

  };

  static getDetail = async (collection: Model<any>, conditions: any = {}) => {
    let result = await collection.find(conditions);
    return result;
  };

  static addRecord = async (collection: Model<any>, source: any, fields: string[]) => {
    let recordToSave = {};
    for (let field of fields) {
      recordToSave[field] = source[field];
    }

    let newRecord = new collection(recordToSave);

    try {
      return await newRecord.save();
    } catch (error) {
      console.error(error);
      return null;
    }

  };

  static deleteRecord = async (collection: Model<any>, conditions: any) => {

    try {
      return await collection.remove(conditions);
    } catch (error) {
      console.error(error);
      return null;
    }

  };

}