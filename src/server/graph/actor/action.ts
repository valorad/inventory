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

    }
    return newActor;
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

  delete = async (conditions: any) => {
    let matchInfo: any[] = [];

    if (conditions && (typeof conditions === 'string')) {
      conditions = JSON.parse(conditions);
    }

    let metActors = await actorAction.getList(conditions) as IActor[];

    for (let actor of metActors) {
      // delete translation
      await translationAction.delete({
        dbname: actor.dbname
      })
    }

    // delete met actors
    let delResult = await actorAction.delete(conditions);

    return delResult;

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