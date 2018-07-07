import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

interface InvItem {
  icon?: string,
  name?: string,
  type?: string,
  value?: number,
  weight?: number
}

// interface InvItem {
//   holder: string,
//   item: string,
//   refDetails: any[],
//   // item base info
//   base: {
//     dbname: string,
//     value: number,
//     weight: number,
//     category: string,
//     detail?: {
//       rating?: number,
//       type?: string,
//       equipI18n?: any,
//       effectsI18n?: any,
//       content?: string
//     }
//   }
// }

interface IconDict {
  [index: string]: string;
}

const iconDict: IconDict = {
  "type-misc": "icon-default-misc",
  "type-food": "icon-default-food",
  "type-crossbow": "icon-weapon-crossbow",
  "type-heavyarmor": "icon-armor-heavy-body",
  "type-ingredient": "icon-default-ingredient",
  _default: "icon-default-misc"
}

export class SkyuiDataSource extends DataSource<InvItem> {

  /** Stream of data that is provided to the table. */
  data: BehaviorSubject<InvItem[]>;

  assignIcon = (invItems: InvItem[]) => {
    for (let item of invItems) {
      if (item.type && iconDict[item.type]) {
        item.icon = iconDict[item.type];
      } else {
        item.icon = iconDict["_default"];
      }
      
    }
  };

  constructor(
    invItems: InvItem[]
  ) {
    super();
    this.assignIcon(invItems);
    this.data = new BehaviorSubject<InvItem[]>(invItems);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<InvItem[]> {
    return this.data || [];
  }

  disconnect() {}
}