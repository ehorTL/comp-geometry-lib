import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBiographyPageComponent } from './my-biography-page.component';

describe('MyBiographyPageComponent', () => {
  let component: MyBiographyPageComponent;
  let fixture: ComponentFixture<MyBiographyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBiographyPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBiographyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
