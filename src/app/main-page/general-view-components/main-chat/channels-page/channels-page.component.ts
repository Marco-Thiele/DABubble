import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { ChannelEditComponent } from 'src/app/main-page/channels-components/channel-edit/channel-edit.component';
import { ChannelMembersComponent } from 'src/app/main-page/channels-components/channel-members/channel-members.component';
import { AddChannelMembersComponent } from 'src/app/main-page/channels-components/add-channel-members/add-channel-members.component';

@Component({
  selector: 'app-channels-page',
  templateUrl: './channels-page.component.html',
  styleUrls: ['./channels-page.component.scss'],
})
export class ChannelsPageComponent implements OnInit {
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;

  selectedChannel: any;
  members: any[] = [];
  autoScrollEnabled = true;

  constructor(
    private dialog: MatDialog,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {}

  /**
   * Shows the edit Channel component
   */
  editChannel(selectedChannel: any) {
    const dialogRef = this.dialog.open(ChannelEditComponent, {
      data: { selectedChannel },
    });
    this.sharedService.setIsEditChannelOpen(true);

    dialogRef.afterClosed().subscribe(() => {
      this.sharedService.setIsEditChannelOpen(false);
    });
  }

  /**
   * Gets the value of the edit channel component.
   * @returns true if the edit channel component is open, false otherwise
   */
  isEditChannelOpen(): boolean {
    return this.sharedService.getIsEditChannelOpen();
  }

  /**
   * Shows the members component
   */
  showMembers() {
    const members = this.selectedChannel.members;
    const channel = this.selectedChannel;
    const channelName = this.selectedChannel.name;
    const dialogRef = this.dialog.open(ChannelMembersComponent, {
      data: { members, channel, channelName },
    });
  }

  /**
   * Shows the add members component
   */
  addMembers() {
    const members = this.selectedChannel.members;
    const dialogRef = this.dialog.open(AddChannelMembersComponent, {
      data: {
        selectedChannel: this.selectedChannel,
        members: this.members,
      },
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  /**
   * It is executed when the user scrolls
   */
  handleScroll(event: Event) {
    const chatElement = this.chatContainer.nativeElement;
    this.autoScrollEnabled =
      chatElement.scrollHeight - chatElement.scrollTop ===
      chatElement.clientHeight;
  }
}
