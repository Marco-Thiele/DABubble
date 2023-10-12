import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import {
  Firestore,
  doc,
  getDoc,
  addDoc,
  collection,
  collectionData,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  animations: [
    trigger('slideAnimation', [
      state('hidden', style({ transform: 'translateX(0%)' })),
      state('visible', style({ transform: 'translateX(150%)' })),
      transition('hidden => visible', animate('0.5s ease-in')),
      transition('visible => hidden', animate('0.5s ease-out')),
    ]),
  ],
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
  showAnimationContainer: boolean = false;
  animationState: string = 'hidden';

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
        const user = userCredential.user;
        if (user.email) {
          this.updateUserDatainService(user);
          this.addUserToDatabase(user);
          this.startAnimation();
          this.routeToAvatarSelection();
        }
      })
      .catch((error) => {
        this.checkIfNameError();
        this.checkIfEmailError();
        this.checkIfPwdError();
        if (this.noError()) {
          this.mailError = true;
        }
      });
  }

  checkIfNameError() {
    if (this.name.length < 1) {
      this.nameError = true;
    }
    if (this.name.length > 1) {
      this.nameError = false;
    }
  }

  noError() {
    if (!this.mailError && !this.pwdError && !this.nameError) {
      return true;
    } else {
      return false;
    }
  }

  checkIfEmailError() {
    if (this.email.includes('@')) {
      this.mailError = false;
    }
    if (!this.email.includes('@')) this.mailError = true;
  }

  checkIfPwdError() {
    if (this.password.length < 8) {
      this.pwdError = true;
      if (this.password.length >= 8) {
        this.pwdError = false;
      }
    }
  }

  startAnimation() {
    this.showAnimationContainer = true;
    this.animationState = 'visible';
    setTimeout(() => {
      this.animationState = 'hidden';
    }, 500);
  }

  routeToAvatarSelection() {
    setTimeout(() => {
      this._router.navigateByUrl('/pick-avatar');
    }, 1500);
  }

  async addUserToDatabase(user: User) {
    try {
      const docRef = await addDoc(
        this.getUserCollection(),
        this.UserService.userObject.toJson()
      );
      this.UserService.docId = docRef.id;
    } catch (err) {
      console.error(err);
    }
  }

  getUserCollection() {
    return collection(this.firestore, 'users');
  }

  updateUserDatainService(user: any) {
    this.UserService.userObject.name = this.name;
    this.UserService.userObject.email = user.email;
    this.UserService.userObject.uid = user.uid;
  }
}
