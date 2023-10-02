import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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

  constructor(
    public dialogRef: MatDialogRef<ChannelEditComponent>,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {}

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
    this.isEditingDescription = false;
  }

  /**
   * The user leaves the channel
   */
  leaveChannel() {
    this.dialogRef.close();
  }
}
