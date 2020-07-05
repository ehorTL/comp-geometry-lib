import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerAlgoPageContentComponent } from './manager-algo-page-content.component';

describe('ManagerAlgoPageContentComponent', () => {
  let component: ManagerAlgoPageContentComponent;
  let fixture: ComponentFixture<ManagerAlgoPageContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerAlgoPageContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerAlgoPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
