import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import {
  getAuth,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mail-password-reset',
  templateUrl: './mail-password-reset.component.html',
  styleUrls: ['./mail-password-reset.component.scss'],
})
export class MailPasswordResetComponent {
  isPwdFocusedFirst: boolean = false;
  isPwdFocusedSecond: boolean = false;
  newPassword: string = '';
  confirmedPassword: string = '';
  firestore: Firestore = inject(Firestore);
  auth = getAuth();
  oobCode: string = '';
  pwdMatch: boolean = true;
  passwordLengthError: boolean = false;
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe((params) => {
      this.oobCode = params['oobCode'];
    });
  }

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

  resetPassword() {
    if (this.newPassword === this.confirmedPassword) {
      this.pwdMatch = true;
      if (!this.checkPasswordLength()) {
        this.passwordLengthError = true;
      }
      if (this.checkPasswordLength())
        confirmPasswordReset(this.auth, this.oobCode, this.newPassword)
          .then(() => {
            this.router.navigateByUrl('/login');
          })
          .catch((error) => {
            console.error('Password reset error:', error);
          });
    } else {
      this.pwdMatch = false;
    }
  }

  checkPasswordLength() {
    if (this.newPassword.length < 8 && this.confirmedPassword.length < 8) {
      return false;
    }
    if (this.newPassword.length >= 8 && this.confirmedPassword.length >= 8) {
      return true;
    }
    return false;
  }
}
