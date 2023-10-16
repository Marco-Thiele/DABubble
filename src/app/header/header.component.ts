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

  constructor(
    public UserService: UserService,
    private dialogService: DialogService,
    private _router: Router
  ) {
    setInterval(() => {
      this.profilName = UserService.getName();
      this.profilImg = UserService.getPhoto();
    }, 300);
   
    // onSnapshot(this.getChannelsCollection(), (list) => {
    //   list.forEach((element) => {
    //     console.log(element.data());
    //   });
    // });
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
}
