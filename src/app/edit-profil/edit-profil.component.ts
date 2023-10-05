import { Component } from '@angular/core';
import { DialogService } from '../dialog.service';
import { UserService } from '../user.service';
import { getAuth, updateProfile } from '@angular/fire/auth';
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
  newName:any;

  constructor(private dialogService: DialogService, public UserService: UserService,) {
    this.profilName = UserService.getName()
    this.profilImg = UserService.getPhoto()
  }  

  auth = getAuth();
  currentUser = this.auth.currentUser;
  
  closeDialog() {
    this.dialogService.closeDialog();
  }

  saveChanges(){
    console.log(this.newName);
    this.updateUser()
  }


  updateUser() {
    if (this.currentUser) {
      updateProfile(this.auth.currentUser!, {
        displayName: this.newName,
        photoURL: this.profilImg,
      })
        .then(() => {
          console.log('Profile Updated with');
          this.closeDialog();
        this.UserService.name = this.newName;
        console.log(this.UserService.name);
        
        })
        .catch((error) => {
          console.log('Update Error');
        });
    }
  }
}
