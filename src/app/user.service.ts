import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  name = 'Guest';
  photoURL: string = '../../assets/img/avatars/person.svg';
  email: string = 'guest@guest.de';
  currentUser: any;
  uid: string = '';
  firestore: Firestore = inject(Firestore);
  auth = getAuth();

  constructor() {}

  getName() {
    return this.name;
  }

  getPhoto() {
    return this.photoURL;
  }

  getMail() {
    return this.email;
  }

  getUserData() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        if (user.email && user.photoURL && user.displayName && user.uid) {
          this.email = user.email;
          this.name = user.displayName;
          this.photoURL = user.photoURL;
          this.uid = user.uid;
          console.log('initiated service');
        }
      } else {
        console.log('signed out');
      }
    });
  }

  getUserName() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        if (user.displayName) {
          return user.displayName;
        }
      } else {
        console.log('user signed out');
        return 'Guest';
      }
      return undefined;
    });
  }
}
