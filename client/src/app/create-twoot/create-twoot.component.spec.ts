import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTwootComponent } from './create-twoot.component';

describe('CreateTwootComponent', () => {
  let component: CreateTwootComponent;
  let fixture: ComponentFixture<CreateTwootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTwootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTwootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
