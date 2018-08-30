import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

import { InvItem } from "./invItem.interface";
import { SkyUIIcon } from './skyui.icon';
import { SkyUICategory } from './skyui.category';

export class SkyuiDataSource extends DataSource<InvItem> {

  /** Stream of data that is provided to the table. */
  data: BehaviorSubject<InvItem[]>;
  skyUIIcon = new SkyUIIcon();
  skyUICategory = new SkyUICategory();

  constructor(
    invItems: InvItem[]
  ) {
    super();
    this.skyUIIcon.assignIcon(invItems);
    this.skyUICategory.assignCategory(invItems);
    this.data = new BehaviorSubject<InvItem[]>(invItems);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<InvItem[]> {
    return this.data;
  }

  disconnect() {}
}