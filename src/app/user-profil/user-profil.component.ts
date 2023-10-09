import { Component } from '@angular/core';
import { DialogService } from '../dialog.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.scss']
})
export class UserProfilComponent {

  profilName:string;
  profilImg:any;
  profilEmail: string;

  constructor(private dialogService: DialogService, public UserService: UserService) {
    this.profilName = UserService.getName();
    this.profilImg = UserService.getPhoto();
    this.profilEmail = UserService.getMail();
  }


  closeDialog() {
    this.dialogService.closeDialog();
  }

}
