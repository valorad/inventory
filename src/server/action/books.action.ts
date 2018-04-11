import { Query } from "../util/query";
import { IAction } from "./interface/action.interface";
// import schemas
import { books } from '../database/schema/books';

export class BookAction implements IAction {

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
      ["dbname", "content"]
    );
    return newBook;
  };

  updateSingle = async (dbname: string, token: any) => {
    return await Query.setRecord(books, {dbname}, token);
  };

  delete = async (token: any) => {

    let delResult = await Query.deleteRecord(books, token);
    return delResult;

  };

}