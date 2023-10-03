import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private UserService: UserService, private _router: Router) {
    this.auth.languageCode = 'de';
  }

  firestore: Firestore = inject(Firestore);
  auth = getAuth();
  provider = new GoogleAuthProvider();
  email: string = '';
  password: string = '';
  isEmailFocused: boolean = false;
  isPwdFocused: boolean = false;
  pwdError: boolean = false;
  mailError: boolean = false;
  loginCredentialsError: boolean = false;
  requestsError: boolean = false;

  onFocusEmail() {
    this.isEmailFocused = true;
  }

  onFocusPwd() {
    this.isPwdFocused = true;
  }

  onBlurMail() {
    this.isEmailFocused = false;
  }
  onBlurPwd() {
    this.isPwdFocused = false;
  }

  loginUser() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.displayName && user.photoURL) {
          this.UserService.name = user.displayName;
          this.UserService.photoURL = user.photoURL;
          this._router.navigateByUrl('/index');
        }
      })
      .catch((error) => {
        this.checkMail(error.code);
        this.checkPassword(error.code);
        this.checkLogin(error.code);
        this.checkRequests(error.code);
      });
  }

  guestLogin() {
    signInAnonymously(this.auth)
      .then(() => {
        this.UserService.name = 'Guest';
        this.UserService.photoURL = 'person.svg';
        this._router.navigateByUrl('/index');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });
  }

  googleLogin() {
    signInWithPopup(this.auth, this.provider)
      .then((result) => {
        const user = result.user;
        if (user.displayName && user.photoURL) {
          this.UserService.name = user.displayName;
          this.UserService.photoURL = user.photoURL;
          this._router.navigateByUrl('/index');
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  checkMail(error: string) {
    if (error === 'auth/invalid-email') {
      this.mailError = true;
    }
    if (error != 'auth/invalid-email') {
      this.mailError = false;
    }
  }

  checkPassword(error: string) {
    if (error === 'auth/missing-password') {
      this.pwdError = true;
    }
  }

  checkLogin(error: string) {
    if (error === 'auth/invalid-login-credentials') {
      this.loginCredentialsError = true;
    }
    if (error != 'auth/invalid-login-credentials') {
      this.loginCredentialsError = false;
    }
  }

  checkRequests(error: string) {
    if (error === 'auth/too-many-requests') {
      this.requestsError = true;
    }
    if (error != 'auth/too-many-requests') {
      this.requestsError = false;
    }
  }
}
