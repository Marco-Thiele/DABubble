import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('textAnimation', [
      state('hidden', style({ opacity: 0, transform: 'translateX(-350px)' })),
      transition('hidden => visible', [
        animate('1.3s ease', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
    trigger('slideAnimation', [
      state('middle', style({ transform: 'translateX(200px)' })),
      state('left', style({ transform: 'translateX(0)' })),
      transition('middle => left', animate('0.5s ease-in')),
    ]),
    trigger('backgroundAnimation', [
      state('initial', style({ opacity: 1 })),
      state('mid', style({ opacity: 0.5 })),
      state('final', style({ opacity: 0 })),
      transition('initial => mid', animate('0.5s ease-in')),
      transition('mid => final', animate('0.2s ease-in')),
    ]),
    trigger('moveAnimation', [
      state('middle', style({ transform: 'translate(-50%, -50%)' })), // Initial state (centered)
      state(
        'top-left',
        style({ top: '175px', left: '375px', fontSize: '32px' })
      ), // Target state (top-left corner)
      transition('middle => top-left', animate('0.3s ease-out')), // Transition from middle to top-left
    ]),
  ],
})
export class LoginComponent implements OnInit {
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
  textState: string = 'hidden'; // Initial state
  svgTransform: string = 'middle';
  backgroundState: string = 'inital';
  setNone: boolean = false;
  moveState: string = 'middle';
  animationPlayed: boolean = false;

  ngOnInit(): void {
    if (!this.animationPlayed) {
      this.playAnimation();
    }
  }

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
        if (user.displayName && user.photoURL && user.email) {
          this.UserService.name = user.displayName;
          this.UserService.photoURL = user.photoURL;
          this.UserService.email = user.email;
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
        this.UserService.photoURL = '../../assets/img/avatars/person.svg';
        this.UserService.email = 'guest@guest.de';
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
        if (user.displayName && user.photoURL && user.email) {
          this.UserService.name = user.displayName;
          this.UserService.photoURL = user.photoURL;
          this.UserService.email = user.email;
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

  playAnimation() {
    this.textState = 'hidden';
    setTimeout(() => {
      this.svgTransform = 'left';
    }, 500);
    setTimeout(() => {
      this.textState = 'visible';
    }, 1000);
    setTimeout(() => {
      this.moveState = 'top-left';
    }, 2600);
    setTimeout(() => {
      this.backgroundState = 'mid';
    }, 2700);
    setTimeout(() => {
      this.backgroundState = 'final';
      this.setNone = true;
    }, 2900);
    this.animationPlayed = true;
  }
}
