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
  profilEmail: string;

  constructor(private dialogService: DialogService, public UserService: UserService) {
    this.profilName = UserService.getName();
    this.profilImg = UserService.getPhoto();
    this.profilEmail = UserService.getMail();
  }


  /**
   * Close the component
   * 
   */
  closeDialog() {
    this.dialogService.closeDialog();
  }


  /**
   * close the current component and open another component
   * 
   */
  editProfil(){
    this.dialogService.closeDialog();
    this.dialogService.openDialog(EditProfilComponent);
  }
}
