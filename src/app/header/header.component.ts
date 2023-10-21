import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { ProfilComponent } from '../profil/profil.component';
import { DialogService } from '../dialog.service';
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
  chatMessages: string[] = [];
  foundMessages: string[] = [];
  searchTerm: string = '';
  showResults: boolean = false;
  constructor(
    public UserService: UserService,
    private dialogService: DialogService,
    private _router: Router
  ) {
    setInterval(() => {
      this.profilName = UserService.getName();
      this.profilImg = UserService.getPhoto();
    }, 300);
    this.subUserList();
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
        console.log('logged out');
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
        // console.log(this.userArr);
      });
    });
  }

  onSearch(event: Event) {
    this.foundUsers = [];
    const input = (event.target as HTMLInputElement).value;
    this.userArr.forEach((user) => {
      if (user['name'].toLowerCase().includes(input.toLowerCase())) {
        this.foundUsers.push(user);
      }
    });
    this.showResults = true;
    if (input.length === 0) {
      this.showResults = false;
    }
  }

  getUserCollection() {
    return collection(this.firestore, 'users');
  }

  // subChatList() {
  //   return onSnapshot(this.getUserCollection(), (list) => {
  //     list.forEach((element) => {
  //       const userData = element.data();
  //       this.chatMessages.push(userData['email']);
  //     });
  //   });
  // }

  // getChatCollection() {
  //   return collection(this.firestore, 'channels');
  // }
}
