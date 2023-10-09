import { Component } from '@angular/core';
import { DialogService } from '../dialog.service';
import { UserService } from '../user.service';
import { UserProfilComponent } from '../user-profil/user-profil.component';

@Component({
  selector: 'app-secondary-chat',
  templateUrl: './secondary-chat.component.html',
  styleUrls: ['./secondary-chat.component.scss']
})
export class SecondaryChatComponent {

  profilName:string;
  profilImg:any;
  profilEmail: string;

  constructor(private dialogService: DialogService, public UserService: UserService) {
    this.profilName = UserService.getName();
    this.profilImg = UserService.getPhoto();
    this.profilEmail = UserService.getMail();
  }

  showUserProfil(){
    this.dialogService.openDialog(UserProfilComponent);
  }


}
