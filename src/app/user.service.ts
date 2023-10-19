import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection } from '@angular/fire/firestore';
import { getAuth, onAuthStateChanged, User } from '@angular/fire/auth';
import { userData } from './models/userData';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: User | null = null;
  firestore: Firestore = inject(Firestore);
  auth = getAuth();
  userObject: userData = new userData();
  docId: string = '';

  constructor() {
    this.getUserData();
    this.userObject.name = this.getName();
    this.userObject.email = this.getMail();
    this.userObject.photoURL = this.getPhoto();
    this.userObject.uid = this.getId();
  }

  getName() {
    return this.user ? this.user.displayName || 'Guest' : 'Guest';
  }

  getPhoto() {
    return this.user
      ? this.user.photoURL || '../../assets/img/avatars/person.svg'
      : '../../assets/img/avatars/person.svg';
  }

  getMail() {
    return this.user ? this.user.email || 'guest@mail.de' : 'guest@mail.de';
  }

  getId() {
    return this.user ? this.user.uid || '' : '';
  }

  getUserData() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in
        this.user = user;
      } else {
        console.log('signed out');
        this.user = null;
      }
    });
  }
}
