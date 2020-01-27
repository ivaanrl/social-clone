import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HashtagExploreComponent } from './hashtag-explore.component';

describe('HashtagExploreComponent', () => {
  let component: HashtagExploreComponent;
  let fixture: ComponentFixture<HashtagExploreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HashtagExploreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HashtagExploreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
