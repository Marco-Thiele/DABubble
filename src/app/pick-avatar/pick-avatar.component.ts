import { Component } from '@angular/core';
import { getAuth, updateProfile } from '@angular/fire/auth';
import { UserService } from '../user.service';
import { inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pick-avatar',
  templateUrl: './pick-avatar.component.html',
  styleUrls: ['./pick-avatar.component.scss'],
})
export class PickAvatarComponent {
  firestore: Firestore = inject(Firestore);
  isButtonDisabled: boolean = true;
  constructor(private _router: Router, private UserService: UserService) {}

  avatar_list: string[] = [
    'frederickbeck.svg',
    'sofiamueller.svg',
    'noahbraun.svg',
    'steffenhoffmann.svg',
    'eliasneumann.svg',
    'eliseroth.svg',
  ];

  auth = getAuth();
  picked_avatar: string = 'person.svg';
  name: string = this.UserService.getName();
  currentUser = this.auth.currentUser;

  chooseAvatar(picked_img: string) {
    this.picked_avatar = picked_img;
    this.UserService.photoURL = this.picked_avatar;
    this.isButtonDisabled = false;
  }

  updateUser() {
    if (this.currentUser) {
      updateProfile(this.auth.currentUser!, {
        displayName: this.UserService.name,
        photoURL: this.UserService.photoURL,
      })
        .then(() => {
          console.log('Profile Updated with');
          this._router.navigateByUrl('/index');
        })
        .catch((error) => {
          console.log('Update Error');
        });
    }
  }
}
