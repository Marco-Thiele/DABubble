import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { EmitOpenService } from 'src/app/services/emit-open.service';

@Component({
  selector: 'app-principal-page',
  templateUrl: './principal-page.component.html',
  styleUrls: ['./principal-page.component.scss'],
})
export class PrincipalPageComponent implements OnInit {
  isFocused = false;
  memberMatches: any[] = [];
  channelMatches: any[] = [];
  isNewMessageVisible = false;
  inputValue: string = '';
  showContainers: boolean = true;
  selectedMember: any;
  selectedChannel: any;
  placeholderMessageBox = 'Starte eine neue Nachricht';

  constructor(
    private sharedService: SharedService,
    private userService: UserService,
    private EmitOpenService: EmitOpenService
  ) {}

  ngOnInit(): void {}

  /**
   * Changes the color of the input when it is focused
   */
  inputFocused() {
    this.isFocused = true;
  }

  /**
   * Changes the color in input when it is blured
   */
  inputBlurred() {
    this.isFocused = false;
  }

  /**
   * Searches in local storage
   */
  async searchMembersAndChannels(event: Event) {
    const inputText = (event.target as HTMLInputElement).value;

    if (typeof inputText !== 'string') {
      return;
    }

    this.memberMatches = [];
    this.channelMatches = [];
    const searchTerm =
      inputText.startsWith('@') || inputText.startsWith('#')
        ? inputText.substring(1)
        : inputText;

    if (inputText.startsWith('@') || !inputText.startsWith('#')) {
      const members = await this.searchMembers(searchTerm);
      this.memberMatches = members;
    }

    if (inputText.startsWith('#') || !inputText.startsWith('@')) {
      const channels = await this.searchChannels(searchTerm);
      this.channelMatches = channels;
    }

    this.isNewMessageVisible =
      this.memberMatches.length > 0 || this.channelMatches.length > 0;
    if (this.isNewMessageVisible) {
    }
    console.log(this.memberMatches);
  }

  /**
   * Looks for a member in the list of members.
   * @returns the list of private messages
   */
  async searchMembers(searchTerm: string): Promise<any[]> {
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

  /**
   * Opens a private chat with a member and closes the new message component
   * @param member the member to open
   */
  openPrivateContainer(member: any) {
    console.log(member);
    this.selectedMember = member;
    const memberId = member.id;
    this.userService.selectedChatPartner = member;

    this.userService.doesChatExist();
    this.userService.createChat();
    this.userService.chatAlreadyExists = false;
    this.EmitOpenService.emitOpenPrivateContainer(member);
    this.inputValue = '';
    this.showContainers = false;
  }

  /**
   * Opens a channel and closes the new message component
   * @param channel the channel to open
   */
  openChannel(channel: any) {
    this.selectedChannel = channel;
    const channelId = channel.id;
    this.EmitOpenService.emitOpenChannel(channel);
    this.inputValue = '';
  }
}
