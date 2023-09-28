import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
 
  constructor(public dialog: MatDialog) {}
  showInfo(){
    document.getElementById('profilLogout')?.classList.toggle('d-none')
  }

  removeInfo(){
    document.getElementById('profilLogout')?.classList.toggle('d-none')
  }

}
