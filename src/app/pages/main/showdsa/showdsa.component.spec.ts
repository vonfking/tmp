import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowdsaComponent } from './showdsa.component';

describe('ShowdsaComponent', () => {
  let component: ShowdsaComponent;
  let fixture: ComponentFixture<ShowdsaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowdsaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowdsaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
