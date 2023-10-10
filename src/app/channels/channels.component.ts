import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChannelErstellenComponent } from '../channel-erstellen/channel-erstellen.component';
import { SharedService } from '../shared.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChannelsComponent implements OnInit {
  uniqueId = this.sharedService.generateUniqueId();
  profilName: string;
  profilImg: any;
  profilID: string;
  panelOpenState = false;
  isClicked = false;
  channels: any[] = [];
  members: any[] = [];
  selectedMember: any;

  constructor(
    private dialog: MatDialog,
    private sharedService: SharedService,
    public userService: UserService
  ) {
    this.profilName = this.userService.getName();
    this.profilImg = this.userService.getPhoto();
    this.profilID = this.sharedService.getID();
  }

  async ngOnInit(): Promise<void> {
    this.channels = this.sharedService.getChannels();
    this.members = await this.sharedService.getMembers();

    console.log(this.members);

    if (this.members.length === 0) {
      this.members = [
        {
          id: this.profilID,
          name: this.profilName + '(Du)',
          imgProfil: this.profilImg,
          type: 'user',
          channels: ['Office-team'],
          chat: [],
        },
        {
          id: this.sharedService.generateUniqueId(),
          name: 'Sofia Müller',
          imgProfil: 'assets/img/avatars/sofiamueller.svg',
          type: 'member',
          channels: ['Office-team'],
          chat: [],
        },
        {
          id: this.sharedService.generateUniqueId(),
          name: 'Noah Braun',
          imgProfil: 'assets/img/avatars/noahbraun.svg',
          type: 'member',
          channels: ['Office-team'],
          chat: [],
        },
        {
          id: this.sharedService.generateUniqueId(),
          name: 'Elise Roth',
          imgProfil: 'assets/img/avatars/eliseroth.svg',
          type: 'member',
          channels: ['Office-team'],
          chat: [],
        },
        {
          id: this.sharedService.generateUniqueId(),
          name: 'Elias Neumann',
          imgProfil: 'assets/img/avatars/eliasneumann.svg',
          type: 'member',
          channels: ['Office-team'],
          chat: [],
        },
        {
          id: this.sharedService.generateUniqueId(),
          name: 'Steffen Hoffmann',
          imgProfil: 'assets/img/avatars/steffenhoffmann.svg',
          type: 'member',
          channels: ['Office-team'],
          chat: [],
        },
      ];
      this.members.forEach((member) => {
        this.sharedService.addMember(member);
      });
    } else {
      this.members[0].imgProfil = this.profilImg;
      this.members[0].name = this.profilName + '(Du)';
    }
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
  }

  /**
   * Opens the channel container in main chat.
   */
  openChannel(channel: any) {
    this.sharedService.emitOpenChannel(channel);
  }

  /**
   * Opens the private container in main chat.
   */
  openPrivateContainer(member: any) {
    this.selectedMember = member;
    const memberId = member.id;

    const storedPrivateMessages = localStorage.getItem('privateMessages');
    const privateMessages = storedPrivateMessages
      ? JSON.parse(storedPrivateMessages)
      : {};

    if (!privateMessages[memberId]) {
      privateMessages[memberId] = {
        id: memberId,
        member: member.name,
        chat: [],
      };
    }

    localStorage.setItem('privateMessages', JSON.stringify(privateMessages));
    this.sharedService.emitOpenPrivateContainer(member);
  }
}
