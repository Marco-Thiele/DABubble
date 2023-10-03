import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getAuth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent implements OnInit {
  constructor(private _router: Router, private UserService: UserService) {}

  ngOnInit() {}
  isEmailFocused: boolean = false;
  isPwdFocused: boolean = false;
  isNameFocused: boolean = false;
  firestore: Firestore = inject(Firestore);
  auth = getAuth();
  email: string = '';
  password: string = '';
  name: string = '';
  mailError: boolean = false;
  pwdError: boolean = false;
  nameError: boolean = false;
  onFocusEmail() {
    this.isEmailFocused = true;
  }

  onFocusPwd() {
    this.isPwdFocused = true;
  }

  onFocusName() {
    this.isNameFocused = true;
  }

  onBlurMail() {
    this.isEmailFocused = false;
  }
  onBlurPwd() {
    this.isPwdFocused = false;
  }

  onBlurName() {
    this.isNameFocused = false;
  }

  registerUser() {
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        this.UserService.name = this.name;
        this._router.navigateByUrl('/pick-avatar');
      })
      .catch((error) => {
        this.checkNameError();
        this.checkEmailError();
        this.checkPwdError();
        if (!this.mailError && !this.pwdError && !this.nameError) {
          this.mailError = true;
        }
      });
  }

  checkNameError() {
    if (this.name.length < 1) {
      this.nameError = true;
    }
    if (this.name.length > 1) {
      this.nameError = false;
    }
  }

  checkEmailError() {
    if (this.email.includes('@')) {
      this.mailError = false;
    }
    if (!this.email.includes('@')) this.mailError = true;
  }

  checkPwdError() {
    if (this.password.length < 8) {
      this.pwdError = true;
      if (this.password.length >= 8) {
        this.pwdError = false;
      }
    }
  }
}
