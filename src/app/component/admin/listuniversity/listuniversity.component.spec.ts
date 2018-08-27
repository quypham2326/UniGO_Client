import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListuniversityComponent } from './listuniversity.component';

describe('ListuniversityComponent', () => {
  let component: ListuniversityComponent;
  let fixture: ComponentFixture<ListuniversityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListuniversityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListuniversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
