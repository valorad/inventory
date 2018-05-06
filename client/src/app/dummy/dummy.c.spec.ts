import {  async,  ComponentFixture,  TestBed } from '@angular/core/testing';

import { DummyComponent } from './dummy.c';

describe('DC test', () => {
  let component: DummyComponent;
  let fixture: ComponentFixture<DummyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DummyComponent ]
    });
    fixture = TestBed.createComponent(DummyComponent);
    component = fixture.componentInstance;
  }));

  test('should exist', () => {
    expect(component).toBeDefined();
  });

});