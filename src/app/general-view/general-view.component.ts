import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-general-view',
  templateUrl: './general-view.component.html',
  styleUrls: ['./general-view.component.scss'],
})
export class GeneralViewComponent implements OnInit {
  isChannelsClosed = false;
  isChannelOpen = true;
  isMainChatBigger = false;
  isMainChatSmaller = true;
  channelDisplay = '';
  buttonText = 'Workspace-Menü schließen';
  isMenuOpen = true;
  appChannels = true;
  showChannels = true;
  appMainChat = true;
  showMainChat = false;
  appSecondaryChat = true;
  showSecondary = false;
  selectedChannel: any;
  currentChannel: any;
  sendChannel = false;
  isChannelVisible = false;
  isNewMessageVisible = false;
  isPrivatChatContainerVisible = false;
  isChatWithMemberVisible = false;
  isPrivateChatVisible = false;
  placeholderMessageBox = 'Starte eine neue Nachricht';
  sendPrivate = false;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private sharedService: SharedService
  ) {}
  ngOnInit(): void {
    this.onResize();
    this.openNewMessage();
    this.openRespChannelContainer(this.selectedChannel);
  }

  openRespChannelContainer(channel: any) {
    this.sharedService.openRespChannelEvent$.subscribe((channel: any) => {
      console.log('3');
      this.showChannels = false;
      this.appChannels = false;
      this.sharedService.emitOpenChannel(channel);
      this.showMainChat = true;
      this.appMainChat = true;
      // this.isChannelVisible = true;
      // this.isPrivatChatContainerVisible = false;
      // this.isChatWithMemberVisible = false;
      // this.isNewMessageVisible = false;
      // this.isPrivatChatContainerVisible = false;
      // this.isPrivateChatVisible = false;
      // this.selectedChannel = channel;
      // this.currentChannel = channel;
      // this.sendChannel = true;
      // this.sendPrivate = false;
      // this.placeholderMessageBox = 'Nachricht an #' + channel.name;
    });
  }

  /**
   * Opens or closes the workspace menu.
   */
  openCloseWorkspace() {
    if (this.isChannelsClosed) {
      this.workspaceIsOpen();
    } else {
      this.workspaceIsClosed();
    }
  }

  /**
   * Opens the workspace menu.
   */
  workspaceIsOpen() {
    this.isChannelsClosed = false;
    this.isChannelOpen = true;
    this.isMainChatBigger = false;
    this.isMainChatSmaller = true;
    this.channelDisplay = '';
    this.buttonText = 'Workspace-Menü schließen';
    this.isMenuOpen = true;
  }

  /**
   * Closes the workspace menu.
   */
  workspaceIsClosed() {
    this.isChannelsClosed = true;
    this.isChannelOpen = false;
    this.isMainChatBigger = true;
    this.isMainChatSmaller = false;
    setTimeout(() => {
      this.channelDisplay = 'none';
      this.buttonText = 'Workspace-Menü öffen';
      this.isMenuOpen = false;
    }, 1000);
  }

  /**
   * sets the display of the workspace menu to none.
   */
  onResize(event?: Event) {
    if (window.innerWidth < 1000) {
      this.showMainChat = false;
      this.showSecondary = false;
    } else {
      this.showMainChat = this.appMainChat;
      this.showSecondary = this.appSecondaryChat;
    }
  }

  openMainChat() {
    this.showChannels = false;
    this.showMainChat = true;
    this.appMainChat = true;
  }

  openNewMessage() {
    this.sharedService.openRespNewMessage$.subscribe(() => {
      this.showChannels = false;
      this.showMainChat = true;
      this.appMainChat = true;
    });
  }
}
