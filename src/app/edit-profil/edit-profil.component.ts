import { Component } from '@angular/core';
import { DialogService } from '../dialog.service';
import { UserService } from '../user.service';
import {
  getAuth,
  updateEmail,
  updateProfile,
  setPersistence,
  browserSessionPersistence,
  Persistence,
  checkActionCode,
  applyActionCode,
  sendPasswordResetEmail
} from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.component.html',
  styleUrls: ['./edit-profil.component.scss'],
})
export class EditProfilComponent {
  firestore: Firestore = inject(Firestore);
  profilName: string;
  profilImg: any;
  profilEmail: string;
  newName: any;
  newEmail: any;
  auth = getAuth();
  currentUser: any;
  actionCode = '';
  restoredEmail:any = null;
  // 'de';

  constructor(
    private dialogService: DialogService,
    public UserService: UserService, private route: ActivatedRoute, private _router: Router
  ) {
    this.profilName = UserService.getName();
    this.profilImg = UserService.getPhoto();
    this.profilEmail = UserService.getMail();
    this.currentUser = this.auth.currentUser;
    this.route.queryParams.subscribe((params) => {
      this.actionCode = params['oobCode'];
    });
  }

  closeDialog() {
    this.dialogService.closeDialog();
  }

  saveChanges() {
    console.log(this.newName);
    this.updateUser();
    this.changeEmail();
  }

  updateUser() {
    if (this.currentUser) {
      updateProfile(this.auth.currentUser!, {
        displayName: this.newName,
        photoURL: this.profilImg,
        // email: this.newEmail,
      })
        .then(() => {
          console.log('Profile Updated with');
          this.closeDialog();
          this.UserService.userObject.name = this.newName;
          this.UserService.userObject.email = this.newEmail;
          console.log(this.UserService.userObject.name);
          console.log(this.UserService.userObject.email);
        })
        .catch((error) => {
          console.log('Update Error');
        });
    }
  }

  async changeEmail() {
    this.handleRecoverEmail()
    // await setPersistence(this.auth, this.sessionPersistence);

    // // Der Rest Ihres Codes bleibt unverändert
    // updateEmail(this.currentUser, this.newEmail)
    //   .then(() => {
    //     console.log('E-Mail-Adresse erfolgreich aktualisiert.');
    //   })
    //   .catch(error => {
    //     console.error('Fehler beim Aktualisieren der E-Mail-Adresse:', error);
    //   });
  }





  handleRecoverEmail() {
  // Localize the UI to the selected language as determined by the lang
  // parameter.
  // let restoredEmail = null;
  // Confirm the action code is valid.
  checkActionCode(this.auth, this.actionCode).then((info) => {
    // Get the restored email address.
    this.restoredEmail = info['data']['email'];

    // Revert to the old email.
    return applyActionCode(this.auth, this.actionCode);
  }).then(() => {
    // Account email reverted to restoredEmail

    // TODO: Display a confirmation message to the user.

    // You might also want to give the user the option to reset their password
    // in case the account was compromised:
    sendPasswordResetEmail(this.auth, this.restoredEmail).then(() => {
      // Password reset confirmation sent. Ask user to check their email.
    }).catch((error) => {
      // Error encountered while sending password reset code.
      console.log(error);
      
    });
  }).catch((error) => {
    // Invalid code.
    console.log(error);
  });
}
}
