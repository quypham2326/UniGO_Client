import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMajorUnversityComponent } from './view-major-university.component';

describe('ViewMajorUnversityComponent', () => {
  let component: ViewMajorUnversityComponent;
  let fixture: ComponentFixture<ViewMajorUnversityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMajorUnversityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMajorUnversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
