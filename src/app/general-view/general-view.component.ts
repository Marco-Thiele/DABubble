import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit(): void {}

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
}
