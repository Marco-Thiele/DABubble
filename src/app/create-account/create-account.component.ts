import { Component } from '@angular/core';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent {
  isEmailFocused: boolean = false;
  isPwdFocused: boolean = false;
  isNameFocused: boolean = false;

  onFocusEmail() {
    this.isEmailFocused = true;
  }

  onFocusPwd(){
    this.isPwdFocused = true;
  }

  onFocusName() {
    this.isNameFocused = true;
  }

  onBlurMail(){
    this.isEmailFocused = false;
  }
  onBlurPwd() {
    this.isPwdFocused = false;
  }

  onBlurName() {
    this.isNameFocused = false;
  }

  registerUser(){}
}
