import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  show: boolean = false;
  profilName:any;

  constructor(public UserService: UserService) { 
    this.profilName = UserService.getName()
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

  }


  logOut(){

  }

}
