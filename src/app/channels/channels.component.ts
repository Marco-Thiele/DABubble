import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChannelErstellenComponent } from '../channel-erstellen/channel-erstellen.component';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChannelsComponent implements OnInit {
  uniqueId = this.sharedService.generateUniqueId();
  panelOpenState = false;
  isClicked = false;
  channels: any[] = [];
  members: any[] = [
    {
      id: this.uniqueId,
      name: 'Frederick',
      lastName: 'Beck (Du)',
      imgProfil: 'assets/profil-img/profile_bild.svg',
      type: 'user',
    },
    {
      id: this.uniqueId,
      name: 'Sofia',
      lastName: 'Müller',
      imgProfil: 'assets/profil-img/Sofia.svg',
      type: 'member',
    },
    {
      id: this.uniqueId,
      name: 'Noah',
      lastName: 'Braun',
      imgProfil: 'assets/profil-img/Noah.svg',
      type: 'member',
    },
    {
      id: this.uniqueId,
      name: 'Elise',
      lastName: 'Roth',
      imgProfil: 'assets/profil-img/Elise.svg',
      type: 'member',
    },
    {
      id: this.uniqueId,
      name: 'Elias',
      lastName: 'Neumann',
      imgProfil: 'assets/profil-img/Elias.svg',
      type: 'member',
    },
    {
      id: this.uniqueId,
      name: 'Steffen',
      lastName: 'Hoffmann',
      imgProfil: 'assets/profil-img/Steffen.svg',
      type: 'member',
    },
  ];

  constructor(
    private dialog: MatDialog,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.channels = this.sharedService.getChannels();
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
  openChannel() {
    this.sharedService.emitOpenChannel();
  }

  /**
   * Opens the private container in main chat.
   */
  openPrivateContainer(member: any) {
    this.sharedService.emitOpenPrivateContainer(member);
  }
}
