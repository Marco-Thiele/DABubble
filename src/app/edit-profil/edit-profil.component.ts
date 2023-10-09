import { Component } from '@angular/core';
import { DialogService } from '../dialog.service';
import { UserService } from '../user.service';
import { getAuth, updateEmail, updateProfile } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.component.html',
  styleUrls: ['./edit-profil.component.scss']
})
export class EditProfilComponent {
  firestore: Firestore = inject(Firestore);
  profilName: string;
  profilImg: any;
  profilEmail: string;;
  newName:any;
  newEmail:any;
  auth = getAuth();
  currentUser = this.auth.currentUser;

  constructor(private dialogService: DialogService, public UserService: UserService,) {
    this.profilName = UserService.getName();
    this.profilImg = UserService.getPhoto();
    this.profilEmail = UserService.getMail();
  }  

  
  closeDialog() {
    this.dialogService.closeDialog();
  }


  saveChanges(){
    console.log(this.newName);
    this.updateUser()
    //this.changeEmail ()
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
        this.UserService.name = this.newName;
        this.UserService.email = this.newEmail;
        console.log(this.UserService.name);
        console.log(this.UserService.email);
        
        })
        .catch((error) => {
          console.log('Update Error');
        });
    }
  }


//  changeEmail (){
//   user.sendEmailVerification()
//   .then(() => {
//     // E-Mail-Verifizierung erfolgreich gesendet
//     console.log('E-Mail-Verifizierung an', this.newEmail, 'gesendet');

//     // Nach dem Senden der Verifizierungs-E-Mail können Sie die E-Mail aktualisieren
//     return user.updateEmail(this.newEmail);
//   })
//   .then(() => {
//     // Email updated!
//     console.log('email updated', this.newEmail)
//   }).catch((error) => {
//     // An error occurred
//     console.log(error);
//   });
//  } 

}
