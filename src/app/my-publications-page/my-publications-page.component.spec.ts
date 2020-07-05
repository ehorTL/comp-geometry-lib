import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPublicationsPageComponent } from './my-publications-page.component';

describe('MyPublicationsPageComponent', () => {
  let component: MyPublicationsPageComponent;
  let fixture: ComponentFixture<MyPublicationsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPublicationsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPublicationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
