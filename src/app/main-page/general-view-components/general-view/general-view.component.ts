import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { EmitOpenService } from '../../../services/emit-open.service';

@Component({
  selector: 'app-general-view',
  templateUrl: './general-view.component.html',
  styleUrls: ['./general-view.component.scss'],
})
export class GeneralViewComponent implements OnInit {
  isChannelsClosed = false;
  isChannelOpen = true;
  isMainChatcomplete = true;
  isMainChatInit = true;
  isMainChatSmall = false;
  channelDisplay = '';
  buttonText = 'Workspace-Menü schließen';
  isMenuOpen = true;
  showChannels = true;
  showMainChat = true;
  showSecondary = false;
  isThreadsClosed = true;
  isThreadsOpen = false;
  selectedChannel: any;
  selectedMember: any;
  currentChannel: any;
  isChannelVisible = false;
  isNewMessageVisible = false;
  isPrivatChatContainerVisible = false;
  isChatWithMemberVisible = false;
  isPrivateChatVisible = false;
  sendPrivate = false;
  mainChatRespo = false;
  secundaryRespo = false;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private sharedService: SharedService,
    private EmitOpenService: EmitOpenService
  ) {
    EmitOpenService.registeropenThreadCont(() => this.openThreadCont());
    EmitOpenService.registercloseThreads(() => this.closeThreadCont());
  }

  ngOnInit(): void {
    this.openNewMessage();
    this.openRespChannelContainer(this.selectedChannel);
    this.openRespPrivateContainer(this.selectedMember);
    this.openRespThreadsContainer();
    this.closeRespThreadsContainer(this.selectedChannel);
    this.EmitOpenService.onResizeRequestedSubject$.subscribe(() => {
      this.openChannelsContainer();
    });
  }

  /**
   * opens the channel container in the responsive view
   * @param channel the channel to open
   */
  openRespChannelContainer(channel: any) {
    this.EmitOpenService.openRespChannelEvent$.subscribe((channel: any) => {
      this.showChannels = false;
      this.showMainChat = true;
      this.mainChatRespo = true;
    });
  }

  /**
   * opens the private container in the responsive view
   * @param member the member to open
   */
  openRespPrivateContainer(member: any) {
    this.EmitOpenService.respOpenPrivateContainerEvent$.subscribe(
      (member: any) => {
        this.showChannels = false;
        this.showMainChat = true;
        this.mainChatRespo = true;
      }
    );
  }

  /**
   * opens the threads container in the responsive view
   */
  openRespThreadsContainer() {
    this.EmitOpenService.respOpenThreadsEvent$.subscribe(() => {
      this.showMainChat = false;
      this.mainChatRespo = true;
      this.showSecondary = true;
    });
  }

  /**
   * closes the threads container in the responsive view
   * @param channel the channel to close
   */
  closeRespThreadsContainer(channel: any) {
    this.EmitOpenService.respCloseThreadsEvent$.subscribe(() => {
      this.showSecondary = false;
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
    this.isMainChatcomplete = false;
    this.isMainChatInit = true;
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
    this.channelDisplay = 'none';
    this.buttonText = 'Workspace-Menü öffen';
    this.isMenuOpen = false;
  }

  /**
   * sets the display of the workspace menu to none.
   */
  onResize(event?: Event) {
    if (window.innerWidth < 1000) {
      this.showMainChat = false;
      this.showSecondary = false;
    } else {
      // this.showMainChat = this.appMainChat;
      // this.showSecondary = this.appSecondaryChat;
    }
  }

  /**
   * Opens the channels container.
   */
  openChannelsContainer() {
    this.showChannels = true;
    this.showMainChat = false;
    this.showSecondary = false;
  }

  /**
   * Opens the main chat container.
   */
  openMainChat() {
    this.showChannels = false;
    this.showMainChat = true;
  }

  /**
   * Opens the new message container in main chat.
   */
  openNewMessage() {
    this.EmitOpenService.openRespNewMessage$.subscribe(() => {
      this.showChannels = false;
      this.showMainChat = true;
      this.mainChatRespo = true;
    });
  }

  /**
   * Opens the thread container.
   */
  openThreadCont() {
    this.isMainChatSmall = true;
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
    this.showSecondary = false;
  }
}
