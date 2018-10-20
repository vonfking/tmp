import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowdstComponent } from './showdst.component';

describe('ShowdstComponent', () => {
  let component: ShowdstComponent;
  let fixture: ComponentFixture<ShowdstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowdstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowdstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
