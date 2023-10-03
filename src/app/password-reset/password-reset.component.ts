import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { getAuth, sendPasswordResetEmail } from '@angular/fire/auth';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent {
  firestore: Firestore = inject(Firestore);
  auth = getAuth();
  email: string = '';
  isEmailFocused: boolean = false;
  mailError: boolean = false;
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
    if (this.checkMail()) {
      sendPasswordResetEmail(this.auth, this.email)
        .then(() => {
          this._router.navigateByUrl('/login');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error.code);
        });
    }
  }

  checkMail() {
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
}
