import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MelodyPage } from './melody.page';

describe('MelodyPage', () => {
  let component: MelodyPage;
  let fixture: ComponentFixture<MelodyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MelodyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MelodyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
