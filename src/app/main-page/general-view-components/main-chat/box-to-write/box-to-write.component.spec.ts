import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxToWriteComponent } from './box-to-write.component';

describe('BoxToWriteComponent', () => {
  let component: BoxToWriteComponent;
  let fixture: ComponentFixture<BoxToWriteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoxToWriteComponent]
    });
    fixture = TestBed.createComponent(BoxToWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
