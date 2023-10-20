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
  showMainChat = true;
  appSecondaryChat = true;
  showSecondary = true;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private sharedService: SharedService
  ) {}
  ngOnInit(): void {
    this.onResize();
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
    if (window.innerWidth < 800) {
      this.showMainChat = false;
      this.showSecondary = false;
    } else {
      this.showMainChat = this.appMainChat;
      this.showSecondary = this.appSecondaryChat;
    }
  }

  openMainChat() {
    console.log('openMainChat');
    this.showChannels = false;
    this.showMainChat = true;
    this.appMainChat = true;
  }
}
