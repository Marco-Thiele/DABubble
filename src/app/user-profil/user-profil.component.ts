import { Component } from '@angular/core';
import { DialogService } from '../dialog.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.scss'],
})
export class UserProfilComponent {
  profilName: string;
  profilImg: any;
  profilEmail: string;

  constructor(
    private dialogService: DialogService,
    public UserService: UserService
  ) {
    this.profilName = this.UserService.selectedUserName;
    this.profilImg = this.UserService.selectedUserPhotoURL;
    this.profilEmail = this.UserService.selectedUserEmail;
  }

  /**
   * close this component
   *
   */
  closeDialog() {
    this.dialogService.closeDialog();
  }
}
