import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isEmailFocused: boolean = false;
  isPwdFocused: boolean = false;

  onFocusEmail() {
    this.isEmailFocused = true;
  }

  onFocusPwd(){
    this.isPwdFocused = true;
  }

  onBlurMail(){
    this.isEmailFocused = false;
  }
  onBlurPwd() {
    this.isPwdFocused = false;
  }
}
