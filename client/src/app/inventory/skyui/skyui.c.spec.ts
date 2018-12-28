import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// mat modules
import { CdkTableModule } from '@angular/cdk/table';

// services
import { DataService } from 'src/app/_services/data.s';
import { ActorService } from 'src/app/_services/actor.s';

import { SkyUIComponent } from './skyui.c';

describe('SkyUIComponent test', () => {
  let component: SkyUIComponent;
  let fixture: ComponentFixture<SkyUIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        CdkTableModule,
        HttpClientModule,
        HttpClientTestingModule
      ],
      declarations: [ SkyUIComponent ],
      providers: [
        DataService,
        ActorService
      ]
    });
    fixture = TestBed.createComponent(SkyUIComponent);
    component = fixture.componentInstance;
  }));

  test('should exist', () => {
    expect(component).toBeDefined();
  });

  // unit test plans:

  // ===> data test

  // receive actor data

  // receive invItem data

  // change Tab to Weapons, the number of filtered list should be equal to the number of weapons

  // after search, the filtered list should contain the correct result

  // ===> equip test

  // mouse enter one armor, the "currentDetail" should get the correct info

  // mouse click an armor (takes up only equip-head), the actor equiped object should store info (i.e. equipped an armor)
  // ..., and the equipped symbol should appear

  // mouse click another armor (takes up more than equip-head, e.g. also with equip-chest, equip-foot, etc),
  // ..., the equip symbol of the previous armor should disappear

  // mouse click a 2H weapon, both hands should be equipped (i.e. =LR=> )

  // then mouse left-click a 1H weapon (quantity = 1), only right hand is equiped (i.e. =R=>)

  // then mouse right-click the 1H weapon, only left hand is equiped (i.e. =L=>)

  // then right-click the 1H weapon again, now it should be unequiped

  // mouse left-click and right-click another 1H weapon (quantity >= 2)
  // ..., should now both hands are equipped (i.e. =LR=>)

  // then click a 2H weapon, the symbol of the 1H weapon should be removed
  // ..., and the 2H weapon should take up both hands (i.e. =LR=>)

});