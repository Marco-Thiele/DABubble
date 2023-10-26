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
import { Observable } from 'rxjs';

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
  selectedChatPartner: any;
  currentChat: any;
  availableChatPartners: DocumentData[] = [];
  currentChatId: string = '';

  constructor() {
    this.getUserData();
    this.subPrivateChat();

    console.log('current chats: ', this.foundPrivateMessages);
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
      profileImg: this.user
        ? this.user.photoURL
        : '../../assets/img/avatars/person.svg',
      imageUrl: '',
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      text: this.messageText,
      userEmail: this.user ? this.user.email : 'guest@guest.de',
      reactions: [],
    };
  }

  sendPrivateChatMessage() {
    this.currentChat.push(this.privateMessage());
  }

  getPrivateChannels() {
    return collection(this.firestore, 'private-channels');
  }

  subPrivateChat() {
    return onSnapshot(this.getPrivateChannels(), (channel) => {
      this.availableChatPartners = [];
      channel.forEach((chat) => {
        const privateChat = chat.data();

        if (this.user) {
          if (privateChat['participants'].includes(this.user.uid)) {
            this.foundPrivateMessages.push(privateChat);
            privateChat['participantsInfos'].forEach((user: any) => {
              if (user.name != this.user?.displayName) {
                if (!this.availableChatPartners.includes(user)) {
                  this.availableChatPartners.push(user);
                }
              }
            });
          }
        }
      });
    });
  }

  doesChatExist() {
    this.foundPrivateMessages.forEach((chat) => {
      if (
        chat['participants'].includes(this.user?.uid) &&
        chat['participants'].includes(this.selectedChatPartner.uid)
      ) {
        console.log('chat exists.. ', chat);
        this.currentChat = chat;
      }
    });

    if (this.currentChat == undefined) {
      this.createChatinDB();
      console.log('creating chat');
      this.subToChosenChat();
      console.log('subscribed to created chat', this.currentChat);
    }
  }

  getAvailableChats() {
    this.foundPrivateMessages.forEach((message) => {
      message['participantsInfos'].forEach((user: DocumentData) => {
        if (user['name'] != this.user?.displayName) {
        }
      });
    });
  }

  createPrivateChat() {
    return {
      participants: [this.user?.uid, this.selectedChatPartner.uid],
      participantsInfos: [
        {
          name: this.user?.displayName,
          profileImg: this.user?.photoURL,
          uid: this.user?.uid,
          email: this.user?.email,
        },
        this.selectedChatPartner,
      ],
      chat: [],
    };
  }

  subToChosenChat(): Observable<any> {
    return new Observable((observer) => {
      const unsubscribe = onSnapshot(this.getPrivateChannels(), (chats) => {
        const currentChat = {};
        chats.forEach((chat) => {
          const chatData = chat.data();
          if (
            chatData['participants'] &&
            this.user &&
            chatData['participants'].includes(this.user.uid) &&
            chatData['participants'].includes(this.selectedChatPartner.uid)
          ) {
            this.currentChatId = chat.id;
            this.currentChat = chatData;
            console.log('current chat: ', this.currentChat);
            console.log('current chat Id: ', this.currentChatId);
          }
        });
        observer.next(this.currentChat);
      });

      return () => unsubscribe();
    });
  }

  async createChatinDB() {
    await addDoc(this.getPrivateChannels(), this.createPrivateChat());
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
