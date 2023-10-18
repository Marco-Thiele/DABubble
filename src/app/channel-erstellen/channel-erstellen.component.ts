import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { NewChannelMembersComponent } from '../new-channel-members/new-channel-members.component';
import { SharedService } from '../shared.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-channel-erstellen',
  templateUrl: './channel-erstellen.component.html',
  styleUrls: ['./channel-erstellen.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChannelErstellenComponent implements OnInit {
  isInputNameFocused = false;
  isInputDescriptionFocused = false;
  channel: any = {};

  constructor(
    public dialogRef: MatDialogRef<ChannelErstellenComponent>,
    private dialog: MatDialog,
    private sharedService: SharedService,
    public userService: UserService
  ) {}

  ngOnInit(): void {}

  /**
   * Closes the dialog for creating a channel.
   */
  closeCreateChannel() {
    this.dialogRef.close();
  }

  /**
   * Sets the height on the input field for the channel description.
   */
  onTextareaInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = '25px';
    target.style.height = target.scrollHeight + 'px';
  }

  /**
   * Creates a channel.
   */
  createChannel() {
    if (this.channel.name) {
      const uniqueId = this.sharedService.generateUniqueId();
      const description = this.channel.description || 'add a description';
      const channelData = {
        id: uniqueId,
        name: this.channel.name,
        description: description,
        members: [],
        chat: [],
        owner: this.userService.getName(),
      };

      const dialogRef = this.dialog.open(NewChannelMembersComponent, {
        data: { channel: channelData },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.dialogRef.close();
        }
      });
      this.dialogRef.close();
    } else {
      alert('Please, enter a name for the channel.');
    }
  }
}
