import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import {
  getAuth,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from '@angular/fire/auth';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mail-password-reset',
  templateUrl: './mail-password-reset.component.html',
  styleUrls: ['./mail-password-reset.component.scss'],
  animations: [
    trigger('slideAnimation', [
      state('hidden', style({ transform: 'translateX(0%)' })),
      state('visible', style({ transform: 'translateX(150%)' })),
      transition('hidden => visible', animate('0.5s ease-in')),
      transition('visible => hidden', animate('0.5s ease-out')),
    ]),
  ],
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
  showAnimationContainer: boolean = false;
  animationState: string = 'hidden';

  constructor(private route: ActivatedRoute, private _router: Router) {
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
    if (this.passwordMatches()) {
      this.setPasswordMatchesToTrue();
      if (this.passwordLengthTooShort()) {
        this.setPasswordLengthError();
      }
      if (this.passwordLengthIsEnough()) {
        this.changePassword();
      }
    } else {
      this.passwordsDontMatch();
    }
  }

  changePassword() {
    confirmPasswordReset(this.auth, this.oobCode, this.newPassword)
      .then(() => {
        this.startAnimation();
        this.routeToLogin();
      })
      .catch((error) => {
        console.error('Password reset error:', error);
      });
  }

  passwordsDontMatch() {
    this.pwdMatch = false;
  }

  passwordLengthIsEnough() {
    if (this.newPassword.length >= 8 && this.confirmedPassword.length >= 8) {
      return true;
    } else {
      return false;
    }
  }

  passwordLengthTooShort() {
    if (this.newPassword.length < 8 && this.confirmedPassword.length < 8) {
      return true;
    }
    return false;
  }

  setPasswordLengthError() {
    this.passwordLengthError = true;
  }

  startAnimation() {
    this.showAnimationContainer = true;
    this.animationState = 'visible';
    setTimeout(() => {
      this.animationState = 'hidden';
    }, 500);
  }

  routeToLogin() {
    setTimeout(() => {
      this._router.navigateByUrl('/login');
    }, 1500);
  }

  passwordMatches() {
    if (this.newPassword === this.confirmedPassword) {
      return true;
    } else {
      return false;
    }
  }

  setPasswordMatchesToTrue() {
    this.pwdMatch = true;
  }
}
