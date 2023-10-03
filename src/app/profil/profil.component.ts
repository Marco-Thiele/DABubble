import { Component } from '@angular/core';
import { DialogService } from '../dialog.service';

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
}
