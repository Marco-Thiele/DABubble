import { Component } from '@angular/core';
import { DialogService } from '../dialog.service';
import { EditProfilComponent } from '../edit-profil/edit-profil.component';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent {

  constructor(private dialogService: DialogService) {}


  closeDialog() {
    this.dialogService.closeDialog();
  }


  editProfil(){
    this.dialogService.openDialog(EditProfilComponent);
  }
}
