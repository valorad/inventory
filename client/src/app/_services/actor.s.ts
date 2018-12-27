import { Injectable } from '@angular/core';

import { IActor } from '../_interfaces/actor.i';

@Injectable()
export class ActorService {


  equip = (equiped: IActor["equiped"], invItemID: string, equiptTo: string[]) => {
    for (let pos of equiptTo) {
      equiped[pos] = invItemID;
    }
    return equiped;
  };

  unequipFrom = (equiped: IActor["equiped"], equiptTo?: string[]) => {

    if (equiptTo) {
      for (let pos of equiptTo) {
        delete equiped[pos];
      }    
    }
    
    return equiped;

  };

  unequip = (equiped: IActor["equiped"], invItemID: string) => {

    for (let key in equiped) {
      if (equiped[key] === invItemID) {
        delete equiped[key];
      }
    }

    return equiped;
  };

  constructor(
    
  ) { }

}
