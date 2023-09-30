import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailPasswordResetComponent } from './mail-password-reset.component';

describe('MailPasswordResetComponent', () => {
  let component: MailPasswordResetComponent;
  let fixture: ComponentFixture<MailPasswordResetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MailPasswordResetComponent]
    });
    fixture = TestBed.createComponent(MailPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
