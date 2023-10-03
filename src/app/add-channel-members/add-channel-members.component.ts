import { Component, OnInit, ViewEncapsulation, Renderer2 } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-channel-members',
  templateUrl: './add-channel-members.component.html',
  styleUrls: ['./add-channel-members.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddChannelMembersComponent implements OnInit {
  userFound = false;
  isDialogOpen = false;

  constructor(
    public dialogRef: MatDialogRef<AddChannelMembersComponent>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.isDialogOpen = true;
    this.renderer.addClass(document.body, 'dialog-open');
  }

  /**
   * The function is used to close the dialog
   */
  closeAddMembers() {
    this.dialogRef.close();
  }

  /**
   * The function is used to look for the user
   */
  lookForUser() {
    this.userFound = true;
  }
  /**
   * Add members to the channel
   */
  addMember() {
    this.dialogRef.close();
  }
}
