import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  onSnapshot,
} from '@angular/fire/firestore';
import { getAuth, onAuthStateChanged, User } from '@angular/fire/auth';
import { userData } from './models/userData';
import { DocumentData } from 'rxfire/firestore/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: User | null = null;
  firestore: Firestore = inject(Firestore);
  auth = getAuth();
  userObject: userData = new userData();
  docId: string = '';
  selectedUserName: string = 'Guest';
  selectedUserPhotoURL: string = '../../assets/img/avatars/person.svg';
  selectedUserEmail: string = 'guest@guest.de';
  messageText: string = '';
  foundPrivateMessages: DocumentData[] = [];
  usersList: DocumentData[] = [];
  constructor() {
    this.getUserData();
    this.getUserList;
    this.userObject.name = this.getName();
    this.userObject.email = this.getMail();
    this.userObject.photoURL = this.getPhoto();
    this.userObject.uid = this.getId();
    this.userObject.chat = [];
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

  privateMessage() {
    return {
      userName: this.user ? this.user.displayName : 'Guest',
      userPhotoURL: this.user
        ? this.user.photoURL
        : '../../assets/img/avatars/person.svg',
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      text: this.messageText,
      userEmail: this.user ? this.user.email : 'guest@guest.de',
      reactions: [],
    };
  }

  sendPrivateChatMessage() {
    const privateMessages: [] = [];

    const message = {
      participants: [],
      messages: [],
    };
  }

  getPrivateChannels() {
    return collection(this.firestore, 'private-channels');
  }

  subPrivateChat() {
    return onSnapshot(this.getPrivateChannels(), (channel) => {
      channel.forEach((chat) => {
        const privateChat = chat.data();
        // if(privateChat.participants.includes(this.user.uid)){
        //   this.foundPrivateMessages.push(privateChat)
        // }
      });
    });
  }

  getUserList() {
    return onSnapshot(this.getUsers(), (userList) => {
      this.usersList = [];
      userList.forEach((user) => {
        const userData = user.data();
        this.usersList.push(user);
      });
    });
  }

  getUsers() {
    return collection(this.firestore, 'users');
  }
}
