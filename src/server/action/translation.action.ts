import { Query } from "../util/query";
import { IAction } from "./interface/action.interface";
// import schemas
import { translations } from '../database/schema/translations';

export class TranslationAction implements IAction {

  fields = ["dbname", "name", "description"];

  getList = async (conditions: any = {}, page?: number) => {
    let result = await Query.getList(
      translations,
      {
        conditions,
        page,
        perPage: 10
      }
    );
    return result;
  };

  getSingle = async (dbname: string = "") => {
    return await Query.getDetail(translations, {dbname});
  };

  add = async (info: any) => {
    let newTranslation = await Query.addRecord(
      translations,
      info,
      this.fields
    );
    return newTranslation;
  };

  updateSingle = async (dbname: string, token: any) => {
    return await Query.setRecord(translations, {dbname}, token);
  };

  delete = async (token: any) => {

    let delResult = await Query.deleteRecord(translations, token);
    return delResult;

  };

}