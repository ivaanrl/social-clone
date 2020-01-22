import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwootComponent } from './twoot.component';

describe('TwootComponent', () => {
  let component: TwootComponent;
  let fixture: ComponentFixture<TwootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
