import { Component } from '@angular/core';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.component.html',
  styleUrls: ['./edit-profil.component.scss']
})
export class EditProfilComponent {
 

  constructor(private dialogService: DialogService) {}


  closeDialog() {
    this.dialogService.closeDialog();
  }
}
