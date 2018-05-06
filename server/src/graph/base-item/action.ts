import { IBaseItem, INewBaseItem, ITranslatedEffect, ITranslatedEquip } from "./type.interface";

// actions
import { BaseItemAction } from "../../action/base-item.action";
import { TranslationAction } from "../../action/translation.action";
import { GearAction } from "../../action/gear.action";
import { ConsumableAction } from "../../action/consumable.action";
import { BookAction } from "../../action/book.action";

const baseItemAction = new BaseItemAction();
const translationAction = new TranslationAction();

export class Action {

  add = async (input: INewBaseItem) => {
    
    // insert into baseItems collection
    
    let newBaseItem = await baseItemAction.add(input);
    let newDetail: any = null;

    if (newBaseItem) {

      // create translations
      if (input.translations) {
        await translationAction.add({
          dbname: newBaseItem.dbname,
          name: input.translations.name,
          description: input.translations.description
        });

        // books need to add translations
        if (newBaseItem.category === "books" && input.detail["content"]) {
          await translationAction.add({
            dbname: input.detail["content"],
            description: input.translations.bookContent
          });
        }

      }
      
      // according to "category", insert detail info to corresponing col.
      let detailAction = this.selectAction(newBaseItem.category)

      if (detailAction) {

        newDetail = await detailAction.add({
          dbname: newBaseItem.dbname,
          ...input.detail
        });

      }

    }

    return {
      newBaseItem,
      newDetail
    };

    // Then front-end will receive: 
    // {
    //   "data": {
    //     "add": {
    //       "message": "Successfully created new baseItem \"item-t60_pa_chest\" with id \"9090980\"",
    //       "status": "success",
    //       "id": "9090980"
    //     }
    //   }
    // }



  };

  getList = async (conditions: any = {}, page?: number, lang = "en") => {

    let metBaseItems = await baseItemAction.getList(conditions, page);
    let extractedItems: IBaseItem[] = [];

    // extract needed info from mongoose query result
    for (let item of metBaseItems) {

      let ext = this.extractInfo(item, baseItemAction.fields) as IBaseItem;

      // attach i18n info of base
      let translations = await translationAction.getSingle(ext.dbname);
      if (translations && translations[0]) {

        let name: any = null;
        let description: any = null;

        name = translations[0]["name"][lang];
        description = translations[0]["description"][lang];

        // fallback to en
        if (!name) name = translations[0]["name"]["en"];
        if (!description) description = translations[0]["description"]["en"];

        ext.name = name;
        ext.description = description;
      }

      extractedItems.push(ext);
    }



    // attach details
    for (let item of extractedItems) {
      item.detail = await this.attachDetail(item);
      // attach i18n info of detail type or equip
      if (item.detail["type"]) {
        
        let translations = await translationAction.getSingle(item.detail["type"]);
        if (translations && translations[0]) {
          
          let typeName: any = null;
          typeName = translations[0]["name"][lang];

          // fallback to en
          if (!typeName) typeName = translations[0]["name"]["en"];
          
          item.detail["typeName"] = typeName;

        }
      }

      if (item.detail["equip"]) {
        item.detail["equipI18n"] = this.translateEquips(item.detail["equip"], lang);
      }

      if (item.detail["effects"]) {
        item.detail["effectsI18n"] = await this.translateEffects(item.detail["effects"], lang);
      }

      // attach i18n info of book content
      if (item.detail["content"]) {
        let translations = await translationAction.getSingle(item.detail["content"]);
        if (translations && translations[0]) {

          let contentDetail: any = null;
          contentDetail = translations[0]["description"][lang];

          // fallback to en
          if (!contentDetail) contentDetail = translations[0]["description"]["en"];

          item.detail["contentDetail"] = contentDetail;

        }
      }

    }
    return extractedItems;

    // e.g. front-end request
    // query getItemList($conditions: JSON, $page: Int) {
  
    //   baseItems: baseItems(conditions: $conditions, page: $page) {
    //     dbname,
    //     value,
    //     weight,
    //     category,
    //     detail
    //   }
    
    // }

    // ----- params -----

    // {
    //   "page": 1
    // }

  };

  getSingle = async (dbname: string, lang = "en") => {

    let baseItem = {} as IBaseItem;
    let metBaseItems = await baseItemAction.getSingle(dbname);

    if (metBaseItems && metBaseItems[0]) {
      // extract needed info from mongoose query result
      let rawItem = metBaseItems[0];
      baseItem = this.extractInfo(rawItem, baseItemAction.fields) as IBaseItem;

      // attach i18n info
      let translations = await translationAction.getSingle(baseItem.dbname);
      
      if (translations && translations[0]) {

        let name: any = null;
        let description: any = null;

        name = translations[0]["name"][lang];
        description = translations[0]["description"][lang];

        // fallback to en
        if (!name) name = translations[0]["name"]["en"];
        if (!description) description = translations[0]["description"]["en"];

        baseItem.name = name;
        baseItem.description = description;
      }

      // attach details
      baseItem.detail = await this.attachDetail(rawItem);

      // attach i18n info of detail type or equip
      if (baseItem.detail["type"]) {
        let translations = await translationAction.getSingle(baseItem.detail["type"]);
        if (translations && translations[0]) {

          let typeName: any = null;
          typeName = translations[0]["name"][lang];

          // fallback to en
          if (!typeName) typeName = translations[0]["name"]["en"];

          baseItem.detail["typeName"] = typeName;
        }
      }

      if (baseItem.detail["equip"]) {
        baseItem.detail["equipI18n"] = this.translateEquips(baseItem.detail["equip"], lang);
      }

      if (baseItem.detail["effects"]) {
        baseItem.detail["effectsI18n"] = await this.translateEffects(baseItem.detail["effects"], lang);
      }

      // attach i18n info of book content
      if (baseItem.detail["content"]) {
        let translations = await translationAction.getSingle(baseItem.detail["content"]);
        if (translations && translations[0]) {

          let contentDetail: any = null;
          contentDetail = translations[0]["description"][lang];

          // fallback to en
          if (!contentDetail) contentDetail = translations[0]["description"]["en"];

          baseItem.detail["contentDetail"] = contentDetail;
        }
      }

    }

    return baseItem;


    // e.g. front-end request
    // query getItem($dbname: String) {
    //   baseItems: baseItem(dbname: $dbname) {
    //     dbname
    //     value
    //     weight
    //     category
    //     detail
    //   }
    // }

    // ----- params -----

    // {
    //   "dbname": "item-t60_pa_chest-t5"
    // }


  };

  delete = async (conditions: any) => {
    
    let matchInfo: any[] = [];
    let detailDelResult: any = null;
    let baseDelResult: any = null;

    if (conditions && (typeof conditions === 'string')) {
      conditions = JSON.parse(conditions);
    }

    let metBaseItems = await baseItemAction.getList(conditions);
    for (let item of metBaseItems) {
      // store matched item dbname and category
      matchInfo.push(
        {
          dbname: item.dbname,
          category: item.category
        }
      );

    }

    
    for (let item of matchInfo) {
      // delete details
      let action = this.selectAction(item.category);
      
      // delete content translation first if is a book
      if (item.category === "books") {
        let bookDetail = await action.getSingle(item.dbname);
        if (bookDetail && bookDetail.content) {
          await translationAction.delete({
            dbname: bookDetail.content
          })
        }
      }

      detailDelResult = await action.delete({dbname: item.dbname});

      if (detailDelResult) {
        // delete base
        baseDelResult = await baseItemAction.delete(conditions);
        // delete base translation
        await translationAction.delete({
          dbname: item.dbname
        });
      }

    }

    return {
      detailDelResult,
      baseDelResult
    }

  };

  selectAction = (category: string) => {
    let action: any = null;

    switch (category) {
      case 'gears':
      action = new GearAction();
        break;
      case 'consumables':
      action = new ConsumableAction();
        break;
      case 'books':
      action = new BookAction();
        break;
      default: 
        break;
    }
    return action;
  };

  extractInfo = (qResultItem: any, fields: string[]) => {
    let ext = {};
    for (let key of fields) {
      ext[key] = qResultItem[key];
    }
    return ext;
  };

  attachDetail = async (baseItem: any) => {
    let detail: any = {};
    let detailAction = this.selectAction(baseItem.category);
    if (detailAction) {

      let rawDetail = await detailAction.getSingle(baseItem.dbname);

      if (rawDetail && rawDetail.length > 0) {
        detail = this.extractInfo(rawDetail[0], detailAction.fields);
      }

    }
    return detail;
  };

  translateEquips = async (equip: string[], lang = "en") => {
    let tranlsatedEquip: ITranslatedEquip[] = [];
    for (let slot of equip) {
      let translations = await translationAction.getSingle(slot);
      if (translations && translations[0]) {
        let translation = translations[0]["name"][lang];

        // fallback to en
        if (!translation) translation = translations[0]["name"]["en"];

        tranlsatedEquip.push({
          equip: slot,
          name: translation
        });
      }
    }
    return tranlsatedEquip;
  };

  translateEffects = async (effects: string[], lang = "en") => {
    let effectsI18n: ITranslatedEffect[] = [];
    // e.g.
    // {
    //   effect: "effect-increse_intelligence",
    //   name: "提升智力"
    // }

    for (let effect of effects) {
      // effect is of type string
      let effectTranslation = await translationAction.getSingle(effect);
      let effectI18n: ITranslatedEffect = { effect: effect, name: "" };
      if (effectTranslation && effectTranslation[0]) {
        let translation = effectTranslation[0]["name"][lang];

        // fallback to en
        if (!translation) translation = effectTranslation[0]["name"]["en"];

        effectI18n.name = translation;
      }
      effectsI18n.push(effectI18n);
    }

    return effectsI18n;
  };




}