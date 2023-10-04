import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { ProfilComponent } from '../profil/profil.component';
import { DialogService } from '../dialog.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  show: boolean = false;
  profilName:string;
  profilImg:any;

  constructor(public UserService: UserService, private dialogService: DialogService) { 
    this.profilName = UserService.getName()
    this.profilImg = UserService.getPhoto()
    console.log(this.profilImg)
  }
  
  showInfo() {
    this.show = true;
  }


  removeInfo() {
    this.show = false; 
  }


  notRemoveInfo(event:Event){
    event.stopPropagation()
  }


  showProfil(){
    this.dialogService.openDialog(ProfilComponent);
  }


  logOut(){

  }

}
