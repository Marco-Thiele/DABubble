import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { ProfilComponent } from '../profil/profil.component';
import { DialogService } from '../dialog.service';
import { Router } from '@angular/router';
import { getAuth, signOut } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  show: boolean = false;
  profilName: string;
  profilImg: any;
  firestore: Firestore = inject(Firestore);
  auth = getAuth();

  ngOnInit(): void {
    this.UserService.getUserData();
  }

  constructor(
    public UserService: UserService,
    private dialogService: DialogService,
    private _router: Router
  ) {
    this.profilName = UserService.getName();
    this.profilImg = UserService.getPhoto();
    console.log(this.profilImg);
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
