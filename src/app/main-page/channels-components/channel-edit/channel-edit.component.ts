import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { SharedService } from '../../../services/shared.service';
import { AddChannelMembersComponent } from '../add-channel-members/add-channel-members.component';
import { EmitOpenService } from '../../../services/emit-open.service';

@Component({
  selector: 'app-channel-edit',
  templateUrl: './channel-edit.component.html',
  styleUrls: ['./channel-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChannelEditComponent implements OnInit {
  isEditingName = false;
  isEditingDescription = false;
  selectedChannel: any;
  editedChannelName: string = '';
  editedChannelDescription: string = '';
  members: any[] = [];
  channelName: string = '';

  constructor(
    public dialogRef: MatDialogRef<ChannelEditComponent>,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private EmitOpenService: EmitOpenService,
    @Inject(MAT_DIALOG_DATA) public data: { selectedChannel: any }
  ) {
    this.selectedChannel = this.data.selectedChannel;
    this.editedChannelName = this.selectedChannel.name;
    this.editedChannelDescription = this.selectedChannel.description;
    this.members = this.selectedChannel.members;
    this.channelName = this.selectedChannel.channelName;
  }

  ngOnInit(): void {}

  /**
   * Opens the edit channel container
   */
  editChannelContainer(channel: any) {
    this.EmitOpenService.openChannelEvent$.subscribe((channel: any) => {
      this.selectedChannel = channel;
      console.log(channel);
    });
  }
  /**
   * Close the edit channel container
   */
  closeEditChannelContainer() {
    this.dialogRef.close();
    this.EmitOpenService.setIsEditChannelOpen(false);
  }

  /**
   * Edit the channel name
   */
  editName() {
    this.isEditingName = true;
  }

  /**
   * Save the channel name
   */
  saveName() {
    this.selectedChannel.name = this.editedChannelName;
    this.sharedService.updateChannelFS(this.selectedChannel);
    this.isEditingName = false;
  }

  /**
   * Edit the channel description
   */
  editDescription() {
    this.isEditingDescription = true;
  }

  /**
   * Save the channel description
   */
  saveDescription() {
    this.selectedChannel.description = this.editedChannelDescription;
    this.sharedService.updateChannelFS(this.selectedChannel);
    this.isEditingDescription = false;
  }

  /**
   * The user leaves the channel
   */
  leaveChannel() {
    if (this.selectedChannel.id) {
      this.sharedService.deleteChannelFS('channels', this.selectedChannel.id);
    }
    this.EmitOpenService.emitOpenNewMessage();
    this.dialogRef.close();
  }

  /**
   * The user adds members to the channel(responsive)
   */
  addMember() {
    if (window.innerWidth < 500) {
      const dialogRef = this.dialog.open(AddChannelMembersComponent, {
        data: {
          selectedChannel: this.selectedChannel,
          members: this.members,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.dialogRef.close();
        }
      });
    } else {
      const dialogRef = this.dialog.open(AddChannelMembersComponent, {
        data: {
          selectedChannel: this.selectedChannel,
          members: this.members,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.dialogRef.close();
        }
      });
    }
  }
}
