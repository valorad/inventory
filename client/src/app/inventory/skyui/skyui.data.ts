import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

interface InvItems {
  icon?: string,
  name?: string,
  type?: string,
  value?: number,
  weight?: number
}

interface IconDict {
  [index: string]: string;
}

const iconDict: IconDict = {
  misc: "icon-default-misc",
  food: "icon-default-food",
  crossbow: "icon-weapon-crossbow",
  _default: "icon-default-misc"
}

export class SkyuiDataSource extends DataSource<InvItems> {

  /** Stream of data that is provided to the table. */
  data: BehaviorSubject<InvItems[]>;

  assignIcon = (invItems: InvItems[]) => {
    for (let item of invItems) {
      if (item.type && iconDict[item.type]) {
        item.icon = iconDict[item.type];
      } else {
        item.icon = iconDict["_default"];
      }
      
    }
  };

  constructor(
    invItems: InvItems[]
  ) {
    super();
    this.assignIcon(invItems);
    this.data = new BehaviorSubject<InvItems[]>(invItems);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<InvItems[]> {
    return this.data || [];
  }

  disconnect() {}
}