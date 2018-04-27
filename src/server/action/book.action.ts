import { Query } from "../util/query";
import { IAction } from "./interface/action.interface";
// import schemas
import { books } from '../database/schema/books';

export class BookAction implements IAction {

  fields = ["dbname", "content"];

  getAll = async () => {
    return await Query.getList(books);
  };

  getList = async (conditions: any = {}, page?: number) => {
    let result = await Query.getList(
      books,
      {
        conditions,
        page,
        perPage: 10
      }
    );
    return result;
  };

  getSingle = async (dbname: string = "") => {
    return await Query.getDetail(books, {dbname});
  };

  add = async (info: any) => {
    let newBook = await Query.addRecord(
      books,
      info,
      this.fields
    );
    return newBook;
  };

  update = async (conditions: any, token: any) => {
    return await Query.setRecord(books, conditions, token, {updateAll: true});
  };

  updateSingle = async (dbname: string, token: any) => {
    return await Query.setRecord(books, {dbname}, token);
  };

  delete = async (token: any) => {

    let delResult = await Query.deleteRecord(books, token);
    return delResult;

  };

}