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
  isMainChatcomplete = false;
  isMainChatInit = true;
  isMainChatSmall = false;
  channelDisplay = '';
  buttonText = 'Workspace-Menü schließen';
  isMenuOpen = true;
  appChannels = true;
  showChannels = true;
  appMainChat = true;
  showMainChat = true;
  appSecondaryChat = false;
  showSecondary = false;
  isThreadsClosed = true;
  isThreadsOpen = false;
  selectedChannel: any;
  selectedMember: any;
  currentChannel: any;
  sendChannel = false;
  isChannelVisible = false;
  isNewMessageVisible = false;
  isPrivatChatContainerVisible = false;
  isChatWithMemberVisible = false;
  isPrivateChatVisible = false;
  placeholderMessageBox = 'Starte eine neue Nachricht';
  sendPrivate = false;
  mainChatRespo = false;
  secundaryRespo = false;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private sharedService: SharedService
  ) {
    sharedService.registeropenThreadCont(() => this.openThreadCont());
    sharedService.registercloseThreads(() => this.closeThreadCont());
  }

  ngOnInit(): void {
    // this.onResize();
    this.openNewMessage();
    this.openRespChannelContainer(this.selectedChannel);
    this.openRespPrivateContainer(this.selectedMember);
  }

  openRespChannelContainer(channel: any) {
    this.sharedService.openRespChannelEvent$.subscribe((channel: any) => {
      console.log(channel);
      console.log('3');
      this.showChannels = false;
      this.appChannels = false;
      this.showMainChat = true;
      this.appMainChat = true;
      this.mainChatRespo = true;
    });
  }

  openRespPrivateContainer(member: any) {
    console.log('4');
    this.sharedService.respOpenPrivateContainerEvent$.subscribe(
      (member: any) => {
        console.log(member);
        this.showChannels = false;
        this.appChannels = false;
        this.showMainChat = true;
        this.appMainChat = true;
        this.mainChatRespo = true;
      }
    );
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
    this.isMainChatcomplete = false;
    this.isMainChatInit = true;
    // this.isMainChatSmaller = true;
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
    this.isMainChatcomplete = true;
    this.isMainChatInit = true;
    // this.isMainChatSmaller = false;
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

  /**
   * Opens the thread container.
   */
  openThreadCont() {
    this.isMainChatSmall = true;
    this.appSecondaryChat = true;
    this.showSecondary = true;
    this.isThreadsClosed = false;
    this.isThreadsOpen = true;
  }

  /**
   * Closes the thread container.
   */
  closeThreadCont() {
    this.isMainChatSmall = false;
    this.isMainChatInit = true;
    this.isThreadsClosed = true;
    this.isThreadsOpen = false;
    setInterval(() => {
      this.showSecondary = false;
      this.appSecondaryChat = false;
    }, 700);
  }
}
