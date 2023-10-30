import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChannelErstellenComponent } from '../channel-erstellen/channel-erstellen.component';
import { SharedService } from '../shared.service';
import { UserService } from '../user.service';
import { DocumentData } from 'rxfire/firestore/interfaces';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChannelsComponent implements OnInit {
  uniqueId = this.sharedService.generateUniqueId();
  profilImg: any;
  panelOpenState = false;
  isClicked = false;
  channels: any[] = [];
  members: any[] = [];
  selectedMember: any;
  userData: any;
  userArr: DocumentData[] = [];
  foundUsers: DocumentData[] = [];
  chatMessages: string[] = [];
  foundMessages: string[] = [];
  searchTerm: string = '';
  showResults: boolean = false;

  public user = {
    id: this.sharedService.getID(),
    name: this.userService.getName() + '(Du)',
    imgProfil: this.userService.getPhoto(),
    type: 'user',
    channels: ['Office-team'],
    chat: [],
  };

  constructor(
    private dialog: MatDialog,
    private sharedService: SharedService,
    public userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
      this.user.id = this.userData.id;
      this.user.name = this.userData.name;
      this.user.imgProfil = this.userData.imgProfil;
      this.user.type = this.userData.type;
      this.user.channels = this.userData.channels;
      this.user.chat = this.userData.chat;
    }
    localStorage.setItem('userData', JSON.stringify(this.user));
    this.sharedService.addUserToAllgemeinChannel(this.user);
  }

  /**
   * Gets an Array of the channels from Firestore
   * @returns the channels
   */
  getChannelsFS(): any[] {
    return this.sharedService.channelsListArray;
  }

  /**
   * Gets an Array of the members from Firestore
   * @returns the members
   */
  getMembersFS(): any[] {
    return this.sharedService.membersListArray;
  }

  getUsersFS(): any[] {
    return this.userService.availableChatPartners;
  }

  /**
   * Gets the value of the edit channel component.
   * @returns true if the edit channel component is open, false otherwise
   */
  isEditChannelOpen(): boolean {
    return this.sharedService.getIsEditChannelOpen();
  }

  /**
   * Opens the menu of the channels.
   */
  openMenuChannels() {
    this.isClicked = !this.isClicked;
  }

  /**
   * Opens the menu of the direct messages.
   */
  openDirectMessages() {
    this.isClicked = !this.isClicked;
  }

  /**
   * Opens the dialog for creating a channel.
   */
  openNewChannel() {
    this.dialog.open(ChannelErstellenComponent, {});
  }

  /**
   * Opens the new message container in main chat.
   */
  openNewMessage() {
    this.sharedService.emitOpenNewMessage();
    if (window.innerWidth < 1000) {
      this.sharedService.openMainChatContainer();
    }
  }

  /**
   * Opens the channel container in main chat.
   */
  openChannel(channel: any) {
    if (window.innerWidth < 1000) {
      this.sharedService.emitRespOpenChannel(channel);
      this.sharedService.toggleIconResponsive(true);
    }

    this.sharedService.emitOpenChannel(channel);
  }

  /**
   * Opens the private container in main chat.
   */
  openPrivateContainer(member: any) {
    if (window.innerWidth < 1000) {
      this.sharedService.emitRespOpenPrivateContainer(member);
      this.sharedService.toggleIconResponsive(true);
    }
    this.sharedService.emitOpenPrivateContainer(member);
  }

  onSearch(event: Event) {
    this.foundUsers = [];
    const input = (event.target as HTMLInputElement).value;
    this.userArr.forEach((user) => {
      if (user['name'].toLowerCase().includes(input.toLowerCase())) {
        this.foundUsers.push(user);
      }
    });
    this.showResults = true;
    if (input.length === 0) {
      this.showResults = false;
    }
  }
}
