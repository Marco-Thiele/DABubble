import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Inject,
} from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AddChannelMembersComponent } from '../add-channel-members/add-channel-members.component';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-channel-members',
  templateUrl: './channel-members.component.html',
  styleUrls: ['./channel-members.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChannelMembersComponent implements OnInit {
  members: any[] = [];
  channelName: string = '';
  private selectedChannel: any;

  constructor(
    public dialogRef: MatDialogRef<ChannelMembersComponent>,
    private dialog: MatDialog,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.members = data.members;
    this.selectedChannel = data.channel;
    this.channelName = data.channelName;
  }

  ngOnInit(): void {}

  /**
   * Closes the dialog for members of the channel.
   */
  closeMembers() {
    this.dialogRef.close();
  }

  /**
   * Opens the dialog for adding members to the channel.
   */
  addMember() {
    const dialogRef = this.dialog.open(AddChannelMembersComponent, {
      data: {
        selectedChannel: this.selectedChannel,
        members: this.members,
      },
    });
    dialogRef.afterClosed().subscribe(() => {});
    this.dialogRef.close();
  }
}
