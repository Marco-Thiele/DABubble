import { Component } from '@angular/core';

@Component({
  selector: 'app-mail-password-reset',
  templateUrl: './mail-password-reset.component.html',
  styleUrls: ['./mail-password-reset.component.scss'],
})
export class MailPasswordResetComponent {
  isPwdFocusedFirst: boolean = false;
  isPwdFocusedSecond: boolean = false;
  onFocusPwdFirst() {
    this.isPwdFocusedFirst = true;
  }

  onBlurPwdFirst() {
    this.isPwdFocusedFirst = false;
  }

  onFocusPwdSecond() {
    this.isPwdFocusedSecond = true;
  }

  onBlurPwdSecond() {
    this.isPwdFocusedSecond = false;
  }

  recoverUser() {}
}
