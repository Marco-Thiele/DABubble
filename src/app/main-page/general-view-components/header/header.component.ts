import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { ProfilComponent } from '../../profils-components/profil/profil.component';
import { UserProfilComponent } from '../../profils-components/user-profil/user-profil.component';
import { DialogService } from '../../../services/dialog.service';
import { Router } from '@angular/router';
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
import { getAuth, signOut } from '@angular/fire/auth';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { message } from '../../../models/message';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  show: boolean = false;
  profilName: string | any;
  profilImg: any;
  auth = getAuth();
  firestore: Firestore = inject(Firestore);
  userArr: DocumentData[] = [];
  foundUsers: DocumentData[] = [];
  chatMessages: DocumentData[] = [];
  foundMessages: DocumentData[] = [];
  searchTerm: string = '';
  showResults: boolean = false;
  iconResponsive: boolean = false;
  constructor(
    public UserService: UserService,
    private dialogService: DialogService,
    private _router: Router,
    private sharedService: SharedService
  ) {
    setInterval(() => {
      this.profilName = UserService.getName();
      this.profilImg = UserService.getPhoto();
    }, 300);
    this.subUserList();
    this.subChatList();
    this.sharedService.iconResponsive$.subscribe((value) => {
      this.iconResponsive = value;
    });
  }

  /**
   *
   * @returns channels collection
   */
  getChannelsCollection() {
    return collection(this.firestore, 'channels');
  }

  /**
   *
   * @returns private-messages collection
   */
  getPrivateMessagesCollection() {
    return collection(this.firestore, 'private-messages');
  }

  /**
   * Opens the dialog
   *
   */
  showInfo() {
    this.show = true;
  }

  /**
   * close the dialog
   *
   */
  removeInfo() {
    this.show = false;
  }

  /**
   * do not close the info dialog
   *
   * @param event onclick in the info dialog
   */
  notRemoveInfo(event: Event) {
    event.stopPropagation();
  }

  /**
   * open new component
   *
   */
  showProfil() {
    this.dialogService.openDialog(ProfilComponent);
  }

  /**
   * log out for the current user
   *
   */
  logOut() {
    signOut(this.auth)
      .then(() => {
        this.routeToLogin();
      })
      .catch((error) => {
        console.log('error:', error);
      });
  }

  /**
   * navigation to the Login
   *
   */
  routeToLogin() {
    this._router.navigateByUrl('/login');
  }

  subUserList() {
    return onSnapshot(this.getUserCollection(), (list) => {
      list.forEach((element) => {
        const userData = element.data();
        this.userArr.push(userData);
      });
    });
  }

  onSearch(event: Event) {
    this.foundUsers = [];
    this.foundMessages = [];
    const input = (event.target as HTMLInputElement).value;
    this.userArr.forEach((user) => {
      if (user['name'].toLowerCase().includes(input.toLowerCase())) {
        this.foundUsers.push(user);
      }
    });
    this.chatMessages.forEach((message) => {
      if (message['text'].toLowerCase().includes(input.toLowerCase())) {
        this.foundMessages.push(message);
      }
      // message['answers'].forEach((answer: DocumentData) => {
      //   if (answer['text'].toLowerCase().includes(input.toLowerCase())) {
      //     this.foundMessages.push(answer);
      //   }
      // });
    });
    this.showResults = true;
    if (input.length === 0) {
      this.showResults = false;
    }
  }

  getUserCollection() {
    return collection(this.firestore, 'users');
  }

  subChatList() {
    return onSnapshot(this.getChatCollection(), (list) => {
      list.forEach((element) => {
        const chatData = element.data();
        chatData['chat'].forEach((message: any) => {
          if (message.text) {
            this.chatMessages.push(message);
          }
        });
      });
    });
  }

  getChatCollection() {
    return collection(this.firestore, 'channels');
  }

  backToChannels() {
    this.iconResponsive = false;
    this.sharedService.callOnResize();
  }

  showUserProfil(
    userName: string,
    userPhotoURL: string,
    userEmail: string,
    userUID: string
  ) {
    this.UserService.selectedUserName = userName;
    this.UserService.selectedUserPhotoURL = userPhotoURL;
    this.UserService.selectedUserEmail = userEmail;
    this.UserService.selectedUserUid = userUID;
    this.searchTerm = '';
    this.showResults = false;
    this.dialogService.openDialog(UserProfilComponent);
  }
}
