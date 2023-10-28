import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCardDetailComponent } from './item-card-detail.component';

describe('ItemCardDetailComponent', () => {
  let component: ItemCardDetailComponent;
  let fixture: ComponentFixture<ItemCardDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemCardDetailComponent]
    });
    fixture = TestBed.createComponent(ItemCardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
