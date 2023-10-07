import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  name: string = '';
  photoURL: string = '../../assets/img/avatars/person.svg';
  currentUser: any;
  constructor() {}

  getName() {
    return this.name;
  }

  getPhoto() {
    return this.photoURL;
  }
}
