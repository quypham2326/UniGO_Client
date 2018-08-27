import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingBoxComponent } from './waiting-box.component';

describe('WaitingBoxComponent', () => {
  let component: WaitingBoxComponent;
  let fixture: ComponentFixture<WaitingBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
