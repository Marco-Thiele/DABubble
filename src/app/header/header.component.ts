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

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  show: boolean = false;
  profilName: string | any;
  profilImg: any;
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
    console.log(this.profilImg);
    onSnapshot(this.getChannelsCollection(), (list) => {
      list.forEach((element) => {
        console.log(element.data());
      });
    });
  }

  getChannelsCollection() {
    return collection(this.firestore, 'channels');
  }

  getPrivateMessagesCollection() {
    return collection(this.firestore, 'private-messages');
  }

  showInfo() {
    this.show = true;
  }

  removeInfo() {
    this.show = false;
  }

  notRemoveInfo(event: Event) {
    event.stopPropagation();
  }

  showProfil() {
    this.dialogService.openDialog(ProfilComponent);
  }

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

  routeToLogin() {
    this._router.navigateByUrl('/login');
  }
}
