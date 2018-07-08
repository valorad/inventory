import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

import { InvItem } from "./invItem.interface";
import { SkyUIIcon } from './skyui.icon';

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
  skyUIIcon = new SkyUIIcon();

  constructor(
    invItems: InvItem[]
  ) {
    super();
    this.skyUIIcon.assignIcon(invItems);
    this.data = new BehaviorSubject<InvItem[]>(invItems);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<InvItem[]> {
    return this.data || [];
  }

  disconnect() {}
}