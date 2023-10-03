import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AddChannelMembersComponent } from '../add-channel-members/add-channel-members.component';

@Component({
  selector: 'app-channel-members',
  templateUrl: './channel-members.component.html',
  styleUrls: ['./channel-members.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChannelMembersComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ChannelMembersComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  /**
   * Closes the dialog for members of the channel.
   */
  closeMembers() {
    this.dialogRef.close();
  }

  addMember() {
    this.dialog.open(AddChannelMembersComponent, {});
    this.dialogRef.close();
  }
}
