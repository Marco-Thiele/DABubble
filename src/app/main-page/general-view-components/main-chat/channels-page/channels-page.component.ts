import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { ChannelEditComponent } from 'src/app/main-page/channels-components/channel-edit/channel-edit.component';
import { ChannelMembersComponent } from 'src/app/main-page/channels-components/channel-members/channel-members.component';
import { AddChannelMembersComponent } from 'src/app/main-page/channels-components/add-channel-members/add-channel-members.component';
import { Firestore, onSnapshot } from '@firebase/firestore';
import { EmitOpenService } from 'src/app/services/emit-open.service';

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
    private sharedService: SharedService,
    private EmitOpenService: EmitOpenService
  ) {
    this.openChannelContainer(this.selectedChannel);
  }

  ngOnInit(): void {}

  /**
   * It is executed when the view is initialized
   */
  ngAfterViewChecked() {
    if (this.autoScrollEnabled) {
      this.scrollToBottom();
    }
  }

  /**
   * Opens the channel container
   * @param channel the channel to open
   */
  openChannelContainer(channel: any) {
    this.EmitOpenService.openChannelEvent$.subscribe((channel: any) => {
      console.log('channel', channel);
      this.selectedChannel = channel;
      //   this.getMessages(channel);
      //   this.scrollToBottom();
    });
  }

  getMessages(channel: any) {
    return onSnapshot(this.sharedService.getChannelsFromFS(), (list: any) => {
      this.selectedChannel = [];
      list.forEach((element: any) => {
        const channelData = element.data();
        if (channelData.name === channel.name) {
          this.selectedChannel = channelData;
          this.selectedChannel.id = channel.id;
        }
      });
    });
  }

  /**
   * Scrolls to the bottom of the chat
   */
  scrollToBottom() {
    if (this.selectedChannel) {
      const chatElement = this.chatContainer.nativeElement;
      chatElement.scrollTop = chatElement.scrollHeight;
    }
  }

  /**
   * Shows the edit Channel component
   */
  editChannel(selectedChannel: any) {
    const dialogRef = this.dialog.open(ChannelEditComponent, {
      data: { selectedChannel },
    });
    this.EmitOpenService.setIsEditChannelOpen(true);

    dialogRef.afterClosed().subscribe(() => {
      this.EmitOpenService.setIsEditChannelOpen(false);
    });
  }

  /**
   * Gets the value of the edit channel component.
   * @returns true if the edit channel component is open, false otherwise
   */
  isEditChannelOpen(): boolean {
    return this.EmitOpenService.getIsEditChannelOpen();
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
