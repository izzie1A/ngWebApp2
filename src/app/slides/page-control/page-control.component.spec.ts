import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageControlComponent } from './page-control.component';

describe('PageControlComponent', () => {
  let component: PageControlComponent;
  let fixture: ComponentFixture<PageControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageControlComponent]
    });
    fixture = TestBed.createComponent(PageControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
