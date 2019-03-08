import { Injectable } from '@angular/core';

import { Actor } from '../_interfaces/actor.i';

@Injectable()
export class ActorService {


  equip = (equiped: Actor["equiped"], invItemID: string, equiptTo: string[]) => {
    for (let pos of equiptTo) {
      equiped[pos] = invItemID;
    }
    return equiped;
  };

  unequipFrom = (equiped: Actor["equiped"], equiptTo?: string[]) => {

    if (equiptTo) {
      for (let pos of equiptTo) {
        delete equiped[pos];
      }    
    }
    
    return equiped;

  };

  unequip = (equiped: Actor["equiped"], invItemID: string) => {

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
