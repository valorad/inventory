import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

interface InvItems {
  icon?: string,
  name?: string,
  type?: string,
  value?: number,
  weight?: number
}

const invItems: InvItems[] = [
  {
    name: "ebony ore",
    type: "misc",
    value: 1,
    weight: 2
  },
  {
    name: "red apple (5)",
    type: "Food",
    value: 5,
    weight: 0.5
  },
  {
    name: "Crossbow",
    type: "crossbow",
    value: 100,
    weight: 20
  }
];


export class SkyuiDataSource extends DataSource<InvItems> {




  /** Stream of data that is provided to the table. */
  data: BehaviorSubject<InvItems[]> = new BehaviorSubject<InvItems[]>(invItems);

  assignIcon = () => {
    for (let item of invItems) {
      item.icon = "O";
    }
  };

  constructor() {
    super();
    this.assignIcon();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<InvItems[]> {
    return this.data;
  }

  disconnect() {}
}