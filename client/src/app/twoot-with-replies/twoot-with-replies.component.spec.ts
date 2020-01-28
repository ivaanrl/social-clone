import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwootWithRepliesComponent } from './twoot-with-replies.component';

describe('TwootWithRepliesComponent', () => {
  let component: TwootWithRepliesComponent;
  let fixture: ComponentFixture<TwootWithRepliesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwootWithRepliesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwootWithRepliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
