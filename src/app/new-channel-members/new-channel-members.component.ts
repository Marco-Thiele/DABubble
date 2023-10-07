import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-new-channel-members',
  templateUrl: './new-channel-members.component.html',
  styleUrls: ['./new-channel-members.component.scss'],
  standalone: true,
  imports: [
    MatRadioModule,
    FormsModule,
    MatCheckboxModule,
    MatCardModule,
    CommonModule,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class NewChannelMembersComponent implements OnInit {
  membersAdded = false;
  checked: boolean = false;
  showCheckbox: boolean = false;
  disabled = false;
  labelPosition: string;
  indeterminate = false;
  isButtonDisabled: boolean = false;
  buttonColor: string = '#444df2';
  channel: any;

  constructor(
    public dialogRef: MatDialogRef<NewChannelMembersComponent>,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.labelPosition = 'after';
    this.channel = data.channel;
  }

  ngOnInit(): void {}

  /**
   * Close the dialog
   */
  closeAddNewChannelMembers() {
    this.dialogRef.close();
  }

  // addMembers() {
  //   this.channel.members.push(member)
  // }

  /**
   * Add members to the channel
   */
  addNewChannelMembers() {
    if (this.channel.name) {
      this.sharedService.addChannel(this.channel);
      this.dialogRef.close(true);
    }
  }

  /**
   * Change the color of the button and enable or disable it
   * @param value
   */
  onChangeRadioButton(value: string) {
    this.labelPosition = value;

    if (value === 'before') {
      this.showCheckbox = true;
      this.isButtonDisabled = true;
      this.buttonColor = '#686868';
    } else {
      this.showCheckbox = false;
      this.isButtonDisabled = false;
      this.buttonColor = '#444df2';
    }
  }

  /**
   * Disable the button if the user finds a member
   */
  loofForMember() {
    this.isButtonDisabled = false;
    this.buttonColor = '#444df2';
  }
}
