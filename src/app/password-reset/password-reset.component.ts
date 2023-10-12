import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { getAuth, sendPasswordResetEmail } from '@angular/fire/auth';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
  animations: [
    trigger('slideAnimation', [
      state('hidden', style({ transform: 'translateX(0%)' })),
      state('visible', style({ transform: 'translateX(150%)' })),
      transition('hidden => visible', animate('0.5s ease-in')),
      transition('visible => hidden', animate('0.5s ease-out')),
    ]),
  ],
})
export class PasswordResetComponent {
  firestore: Firestore = inject(Firestore);
  auth = getAuth();
  email: string = '';
  isEmailFocused: boolean = false;
  mailError: boolean = false;
  animationState: string = 'hidden';
  showAnimationContainer: boolean = false;

  constructor(private UserService: UserService, private _router: Router) {
    this.auth.languageCode = 'de';
  }

  onFocusEmail() {
    this.isEmailFocused = true;
  }

  onBlurMail() {
    this.isEmailFocused = false;
  }

  recoverUser() {
    if (this.mailIsValid()) {
      sendPasswordResetEmail(this.auth, this.email)
        .then(() => {
          this.startAnimation();
          this.routeToLogin();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error.code);
        });
    }
  }

  mailIsValid() {
    if (this.email.length > 3 && this.email.includes('@')) {
      this.mailError = false;
      return true;
    }
    if (this.email.length <= 3 || !this.email.includes('@')) {
      this.mailError = true;
      return false;
    }
    return false;
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
}
