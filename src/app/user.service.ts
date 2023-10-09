import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getAuth, onAuthStateChanged, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: User | null = null;
  name: string = this.getName();
  photoURL: string = this.getPhoto();
  email: string = this.getMail();
  uid: string = this.getId();
  currentUser: any;
  firestore: Firestore = inject(Firestore);
  auth = getAuth();

  constructor() {
    this.getUserData();
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
