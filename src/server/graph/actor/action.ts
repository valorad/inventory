import { INewActor, IActor } from "./type.interface";
import { ActorAction } from "../../action/actor.action";
import { TranslationAction } from "../../action/translation.action";

const actorAction = new ActorAction();
const translationAction = new TranslationAction();

export class Action {

  add = async (input: INewActor) => {
    let newActor = await actorAction.add(input) as INewActor;
    if (newActor) {

      if (input.translations) {
        // attach i18n
        await translationAction.add({
          dbname: newActor.dbname,
          name: input.translations.name,
          description: input.translations.biography
        });
      }

      return {
        message: `Successfully created new actor "${newActor.dbname}" with id "${newActor["_id"]}"`,
        status: 'success',
        id: newActor["_id"]
      };

    } else {
      return {
        message: `Failed to create new actor "${input.dbname}"`,
        status: 'success',
        id: null
      };
    }
  };

  getList = async (conditions: any = {}, page?: number, lang: string = "en") => {
    let metActors = await actorAction.getList(conditions, page) as IActor[];
    let extractedActors: IActor[] = [];
    
    for (let actor of metActors) {
      let ext = this.extractInfo(actor, actorAction.fields) as IActor;

      // attach i18n info of actor
      await this.translate(ext, lang);

      extractedActors.push(ext);

    }

    return extractedActors;
  };

  getSingle = async (dbname: string, lang = "en") => {
    let actor = {} as IActor;
    let metActors = await actorAction.getSingle(dbname) as IActor[];
    if (metActors && metActors[0]) {
      actor = this.extractInfo(metActors[0], actorAction.fields) as IActor;
      await this.translate(actor, lang);
    }
    return actor;
  };

  extractInfo = (qResultItem: any, fields: string[]) => {
    let ext = {};
    for (let key of fields) {
      ext[key] = qResultItem[key];
    }
    return ext;
  };

  translate = async (actor: IActor, lang: string = "en") => {
    // attach i18n info of actor
    let translations = await translationAction.getSingle(actor.dbname);
    if (translations && translations[0]) {
      actor.name = translations[0]["name"][lang];
      actor.biography = translations[0]["description"][lang];
    }
  };



}