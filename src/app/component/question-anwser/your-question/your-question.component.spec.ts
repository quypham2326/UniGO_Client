import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourQuestionComponent } from './your-question.component';

describe('YourQuestionComponent', () => {
  let component: YourQuestionComponent;
  let fixture: ComponentFixture<YourQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
