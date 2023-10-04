import { Component } from '@angular/core';
import { DialogService } from '../dialog.service';
import { EditProfilComponent } from '../edit-profil/edit-profil.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent {

  profilName:string;
  profilImg:any;

  constructor(private dialogService: DialogService, public UserService: UserService) {
    this.profilName = UserService.getName()
    this.profilImg = UserService.getPhoto()
  }


  closeDialog() {
    this.dialogService.closeDialog();
  }


  editProfil(){
    this.dialogService.closeDialog();
    this.dialogService.openDialog(EditProfilComponent);
  }
}
