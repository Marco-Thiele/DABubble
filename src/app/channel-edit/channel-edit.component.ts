import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '../shared.service';

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

  constructor(
    public dialogRef: MatDialogRef<ChannelEditComponent>,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: { selectedChannel: any }
  ) {
    this.selectedChannel = this.data.selectedChannel;
    this.editedChannelName = this.selectedChannel.name;
    this.editedChannelDescription = this.selectedChannel.description;
  }

  ngOnInit(): void {}

  editChannelContainer(channel: any) {
    this.sharedService.openChannelEvent$.subscribe((channel: any) => {
      this.selectedChannel = channel;
      console.log(channel);
    });
  }
  /**
   * Close the edit channel container
   */
  closeEditChannelContainer() {
    this.dialogRef.close();
    this.sharedService.setIsEditChannelOpen(false);
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
    this.sharedService.updateChannel(this.selectedChannel);
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
    this.sharedService.updateChannel(this.selectedChannel);
    this.isEditingDescription = false;
  }

  /**
   * The user leaves the channel
   */
  leaveChannel() {
    this.dialogRef.close();
  }
}
