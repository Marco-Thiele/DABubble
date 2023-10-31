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
  searchTerm: string = '';
  memberMatches: any[] = [];
  channelMatches: any[] = [];

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

  searchMembersAndChannels(event: Event) {
    console.log('searchMembersAndChannels');
    const inputText = (event.target as HTMLInputElement).value;
    console.log(inputText);
    if (typeof inputText === 'string') {
      this.memberMatches = [];
      this.channelMatches = [];
    } else {
      this.searchMembers(inputText).then((members) => {
        console.log(members);
        this.memberMatches = members;
        this.memberMatches.length > 0 || this.channelMatches.length > 0;
        console.log(this.memberMatches);
      });
      this.searchChannels(inputText).then((channels) => {
        console.log(channels);
        this.channelMatches = channels;
        this.memberMatches.length > 0 || this.channelMatches.length > 0;
        console.log(this.channelMatches);
      });
    }
  }

  async searchMembers(searchTerm: string): Promise<any[]> {
    console.log('searchMembers');
    const members = await this.sharedService.getUsersFS();
    const matchingMembers = members.filter((member: any) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchingMembers.map((member) => ({
      uid: member.id,
      name: member.name,
      profileImg: member.profileImg,
      email: member.email,
    }));
  }

  /**
   * Looks for a channel in the list of channels.
   * @returns the list of private messages
   */
  async searchChannels(searchTerm: string): Promise<any[]> {
    console.log('searchChannels');
    const channels = await this.sharedService.getChannelsFS();
    const matchingChannels = channels.filter((channel: any) =>
      channel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchingChannels.map((channel) => ({
      id: channel.id,
      name: channel.name,
      members: channel.members,
      chat: channel.chat,
      description: channel.description,
      owner: channel.owner,
    }));
  }
}
