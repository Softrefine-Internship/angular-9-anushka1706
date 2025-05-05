import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPlaceholderComponent } from './content-placeholder.component';

describe('ContentPlaceholderComponent', () => {
  let component: ContentPlaceholderComponent;
  let fixture: ComponentFixture<ContentPlaceholderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContentPlaceholderComponent]
    });
    fixture = TestBed.createComponent(ContentPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
