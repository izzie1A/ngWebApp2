import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCardListComponent } from './ItemCardListComponent';

describe('ItemCardListComponent', () => {
  let component: ItemCardListComponent;
  let fixture: ComponentFixture<ItemCardListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemCardListComponent]
    });
    fixture = TestBed.createComponent(ItemCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
