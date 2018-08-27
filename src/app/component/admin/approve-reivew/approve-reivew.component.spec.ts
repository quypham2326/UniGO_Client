import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveReivewComponent } from './approve-reivew.component';

describe('ApproveReivewComponent', () => {
  let component: ApproveReivewComponent;
  let fixture: ComponentFixture<ApproveReivewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveReivewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveReivewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
