import { Component } from '@angular/core';
import { DialogService } from '../dialog.service';
import { UserService } from '../user.service';
import { getAuth, updateProfile, } from '@angular/fire/auth';
import { Firestore, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { userData } from '../models/userData';



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
  docRef: any;
  id: any;
  user: userData = new userData()

  constructor(
    private dialogService: DialogService, public UserService: UserService,) {
    this.profilName = UserService.getName();
    this.profilImg = UserService.getPhoto();
    this.profilEmail = UserService.getMail();
    this.currentUser = this.auth.currentUser;
    this.id = UserService.getId()
    

    // onSnapshot(this.getUsersCollection(), (list) => {
    //   list.forEach((element) => {
    //     console.log(element.data());
    //   })
    // })

  }

/**
 * Return the User collection
 * 
 * @returns User collection
 */
  getUsersCollection() {
    return collection(this.firestore, 'users')
  }


  /**
   * Close the Component
   * 
   */
  closeDialog() {
    this.dialogService.closeDialog();
  }


  /**
   * Save the new name
   * 
   */
  saveChanges() {
    this.updateUser();
  }


  /**
   * Save the new name and close the component
   * 
   */
  updateUser() {
    if (this.currentUser) {
      updateProfile(this.auth.currentUser!, {
        displayName: this.newName,
        photoURL: this.profilImg,
      })
        .then(() => {
          this.closeDialog();
          this.UserService.userObject.name = this.newName;
          this.UserService.userObject.email = this.newEmail;
        })
    }
  }


  // async changeEmailAndName() {
  //   this.docRef = doc(this.firestore, 'users', this.id);
  //   await updateDoc(this.docRef, this.user.toJson())
  // .then(()=>{
  //   console.log('UpdateDoc',this.user);

  // });
  //}





}
