import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerAlgoSectionsComponent } from './manager-algo-sections.component';

describe('ManagerAlgoSectionsComponent', () => {
  let component: ManagerAlgoSectionsComponent;
  let fixture: ComponentFixture<ManagerAlgoSectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerAlgoSectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerAlgoSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
