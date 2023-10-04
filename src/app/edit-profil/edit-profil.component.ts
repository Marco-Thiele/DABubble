import { Component } from '@angular/core';
import { DialogService } from '../dialog.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.component.html',
  styleUrls: ['./edit-profil.component.scss']
})
export class EditProfilComponent {

  profilName: string;
  profilImg: any;

  constructor(private dialogService: DialogService, public UserService: UserService,) {
    this.profilName = UserService.getName()
    this.profilImg = UserService.getPhoto()
  }  

  
  closeDialog() {
    this.dialogService.closeDialog();
  }
}
