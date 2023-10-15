import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPolicyComponent } from './data-policy.component';

describe('DataPolicyComponent', () => {
  let component: DataPolicyComponent;
  let fixture: ComponentFixture<DataPolicyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataPolicyComponent]
    });
    fixture = TestBed.createComponent(DataPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
