import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChannelEditComponent } from '../channel-edit/channel-edit.component';
import { SharedService } from '../shared.service';
import { ChannelMembersComponent } from '../channel-members/channel-members.component';
import { AddChannelMembersComponent } from '../add-channel-members/add-channel-members.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss'],
})
export class MainChatComponent implements OnInit {
  @ViewChild('imagePreviewCont', { read: ElementRef })
  imagePreviewCont: ElementRef;
  @ViewChild('imagePreview', { read: ElementRef }) imagePreview: ElementRef;
  @ViewChild('chatContainer', { read: ElementRef }) chatContainer:
    | ElementRef
    | undefined;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  name = 'Angular';
  message: string = '';
  imageLoaded: boolean = false;
  showEmojiPicker = false;
  isFocused = false;
  taIsFocused = false;
  isChannelVisible = true;
  isNewMessageVisible = false;
  isPrivatChatContainerVisible = false;
  isChatWithMemberVisible = false;
  isPrivateChatVisible = false;
  selectedMember: any;
  selectedChannel: any;
  currentChannel: any;
  placeholderMessageBox = 'Starte eine neue Nachricht';
  messageBox = true;
  sendPrivate = false;
  sendChannel = false;
  memberMatches: any[] = [];
  channelMatches: any[] = [];
  channelsMessages: {
    [channelId: string]: { messagesUser: any[]; messagesMembers: any[] };
  } = {};
  privateChats: {
    [memberId: string]: { messagesUser: any[]; messagesMembers: any[] };
  } = {};
  members: any[] = [];
  selectedFile: File | null = null;
  containerChat: any;
  privateChatMessages: any[] = [];

  private isUserScrolling = false;

  constructor(
    private dialog: MatDialog,
    private sharedService: SharedService,
    public userService: UserService
  ) {
    this.openNewMessage();
    this.loadChannel();
    this.openChannelContainer(this.selectedChannel);
    this.openPrivateContainerMessage(this.selectedMember);
    this.imagePreviewCont = new ElementRef(null);
    this.imagePreview = new ElementRef(null);
  }

  ngOnInit(): void {
    this.getMessagesfromSelectedChannel();
  }

  /**
   * Gets the messages from the selected channel
   */
  getMessagesfromSelectedChannel() {
    const channelId = this.selectedChannel ? this.selectedChannel.id : '';
    const messageType = 'messagesUser';

    if (!this.channelsMessages[channelId]) {
      this.channelsMessages[channelId] = {
        messagesUser: [],
        messagesMembers: [],
      };
    }

    this.channelsMessages[channelId].messagesUser =
      this.sharedService.getMessagesForChannel(channelId, messageType);
  }

  onScroll() {
    this.isUserScrolling = true;
  }

  stopAutoScroll() {
    this.isUserScrolling = false;
  }

  /**
   * Scrolls to the bottom of the chat
   */
  scrollToBottom() {
    if (!this.isUserScrolling && this.chatContainer) {
      const element = this.chatContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  /**
   * Opens the new message component which is used to create a new channel or to start a new chat with a member
   */
  openNewMessage() {
    this.sharedService.openNewMessageEvent$.subscribe(() => {
      this.isNewMessageVisible = true;
      this.isChannelVisible = false;
      this.isChatWithMemberVisible = false;
      this.isPrivatChatContainerVisible = false;
      this.isPrivatChatContainerVisible = false;
      this.isPrivateChatVisible = false;
      this.placeholderMessageBox = 'Starte eine neue Nachricht';
    });
  }

  /**
   * Opens the channel container
   * @param channel the channel to open
   */
  openChannelContainer(channel: any) {
    this.sharedService.openChannelEvent$.subscribe((channel: any) => {
      this.isChannelVisible = true;
      this.isPrivatChatContainerVisible = false;
      this.isChatWithMemberVisible = false;
      this.isNewMessageVisible = false;
      this.isPrivatChatContainerVisible = false;
      this.isPrivateChatVisible = false;
      this.selectedChannel = channel;
      this.currentChannel = channel;
      this.sendChannel = true;
      this.sendPrivate = false;
      this.placeholderMessageBox = 'Nachricht an #' + channel.name;
    });
  }

  /**
   * Opens the private container with a member
   * @param member the member to open
   */
  openPrivateContainerMessage(member: any) {
    this.sharedService.openPrivateContainerEvent$.subscribe((member: any) => {
      if (member && member.type === 'user') {
        this.privateNachricht(member);
      } else {
        this.privateChatWithMember(member);
      }
    });
  }

  /**
   * Sets the variables for a private message
   * @param member
   */
  privateNachricht(member: any) {
    this.isPrivatChatContainerVisible = true;
    this.isPrivateChatVisible = true;
    this.isChatWithMemberVisible = false;
    this.isChannelVisible = false;
    this.isNewMessageVisible = false;
    this.selectedMember = member;
    this.selectedChannel = null;
    this.sendPrivate = true;
    this.sendChannel = false;
    this.placeholderMessageBox = 'Nachricht an ' + member.name;
  }

  /**
   * Sets the variables for a private chat with a member
   * @param member
   */
  privateChatWithMember(member: any) {
    this.isPrivatChatContainerVisible = true;
    this.isChatWithMemberVisible = true;
    this.isPrivateChatVisible = false;
    this.isChannelVisible = false;
    this.isNewMessageVisible = false;
    this.selectedMember = member;
    this.selectedChannel = null;
    this.sendPrivate = true;
    this.sendChannel = false;
    this.placeholderMessageBox = 'Nachricht an ' + member.name;
    this.loadPrivateChats();
  }

  /**
   * Loads the messages to the private chat container
   */
  loadPrivateChats() {
    if (this.selectedMember) {
      this.privateChats[this.selectedMember.id] =
        this.sharedService.returnPrivateChats(this.selectedMember.id);
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
   * Loads the channel
   */
  loadChannel() {
    const channels = this.sharedService.getChannels();
    if (channels.length === 0) {
      this.isNewMessageVisible = true;
      this.isChannelVisible = false;
    } else {
      this.selectChannel(channels[0]);
    }
  }

  /**
   * Selects a channel
   * @param channel the channel to select
   */
  selectChannel(channel: any) {
    this.isChannelVisible = true;
    this.selectedChannel = channel;
    this.currentChannel = channel;
    this.sendChannel = true;
    this.placeholderMessageBox = 'Nachricht an #' + channel.name;
  }

  /**
   * Shows the edit Channel component
   */
  editChannel(selectedChannel: any) {
    this.dialog.open(ChannelEditComponent, {
      data: { selectedChannel },
    });
    this.sharedService.setIsEditChannelOpen(true);
  }

  /**
   * Shows the members component
   */
  showMembers() {
    const members = this.selectedChannel.members;
    const channel = this.selectedChannel;
    const channelName = this.selectedChannel.name;
    const dialogRef = this.dialog.open(ChannelMembersComponent, {
      data: { members, channel, channelName },
    });
  }

  /**
   * Shows the add members component
   */
  addMembers() {
    const members = this.selectedChannel.members;
    const dialogRef = this.dialog.open(AddChannelMembersComponent, {
      data: {
        selectedChannel: this.selectedChannel,
        members: this.members,
      },
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  /**
   * Regulaces the height of the textarea
   */
  onTextareaInput(event: any): void {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = '40px';
    target.style.height = target.scrollHeight + 'px';
  }

  /**
   * Show the emoji picker
   */
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  /**
   * Add an emoji to the message
   */
  addEmoji(event: any) {
    const { message } = this;
    const text = `${message}${event.emoji.native}`;
    this.message = text;
  }

  /**
   * Hide the emoji picker when the textarea is focused
   */
  onFocus() {
    this.showEmojiPicker = false;
  }

  /**
   * Changes the color in input when it is focused
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
   * Changes the color in textarea when it is focused
   */
  textAreaFocused() {
    this.taIsFocused = true;
  }

  /**
   * Changes the color in textarea when it is blured
   */
  textAreaBlurred() {
    this.taIsFocused = false;
  }

  /**
   * Sends a message to the server
   */
  sendChannelMsg() {
    const messageText = this.message.trim();
    const selectedFile = this.selectedFile;

    if ((selectedFile || messageText) && this.currentChannel) {
      const message = {
        userName: this.userService.getName(),
        profileImg: this.userService.getPhoto(),
        imageUrl: '',
        text: messageText,
        time: new Date().toLocaleTimeString(),
        reactions: [],
        answers: [],
      };

      const messageType = 'messagesUser';

      if (selectedFile) {
        this.convertImageToBase64(selectedFile)
          .then((base64Data) => {
            message.imageUrl = base64Data;
            this.saveMessage(message, messageType, this.currentChannel);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        this.saveMessage(message, messageType, this.currentChannel);
      }
    }
  }

  /**
   * Charges an image and shows it in the preview
   */
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    const previewImg = this.imagePreview?.nativeElement;
    this.containerChat = this.chatContainer?.nativeElement;

    if (this.selectedFile && previewImg) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const imgSrc = e.target.result as string;
          if (this.currentChannel || this.selectedMember) {
            if (previewImg) {
              previewImg.onload = () => {
                previewImg.src = imgSrc;
                this.containerChat.style.maxHeight = '270px';
                this.imageLoaded = true;
              };
              previewImg.src = imgSrc;
            }
          }
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
    this.stopAutoScroll();
  }

  /**
   * Saves a message to local storage
   * @param message message from user
   * @param messageType type of message
   * @param messageDate date of message
   */
  saveMessage(
    message: any,
    messageType: 'messagesUser' | 'messagesMembers',
    channelOrMember: any
  ) {
    this.sharedService.saveMessageToLocalStorage(
      channelOrMember.id,
      message,
      messageType
    );

    this.message = '';
    if (this.selectedFile) {
      this.selectedFile = null;
      this.clearPreviewImage();
    }
    this.returnChannelsMessages();
    this.stopAutoScroll();
  }

  /**
   * Converts an image to base64
   * @param file the file to convert
   * @returns the image converted to base64
   */
  convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          resolve(e.target.result as string);
        } else {
          reject('Error al cargar la imagen.');
        }
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Clears the preview image
   */
  clearPreviewImage() {
    const previewImg = this.imagePreview?.nativeElement;
    if (previewImg) {
      previewImg.src = '';
      this.imageLoaded = false;
      this.containerChat.style.maxHeight = '500px';
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
    }
  }

  /**
   * Returns the messages of the channels from server
   */
  returnChannelsMessages() {
    const channelData = this.sharedService.getChannelsIds();
    this.channelsMessages = {};

    for (const channelId in channelData) {
      if (channelData.hasOwnProperty(channelId)) {
        this.channelsMessages[channelId] = {
          messagesUser: channelData[channelId].messagesUser || [],
          messagesMembers: channelData[channelId].messagesMembers || [],
        };
      }
    }
  }

  /**
   * Returns selected messages of the channels from local storage
   */
  getSelectedMessages(messageType: 'messagesUser' | 'messagesMembers'): any[] {
    if (this.selectedChannel) {
      const channelId = this.selectedChannel.id;
      if (this.channelsMessages && this.channelsMessages[channelId]) {
        return this.channelsMessages[channelId][messageType] || [];
      }
    } else if (this.selectedMember) {
      this.privateChats[this.selectedMember.id] =
        this.sharedService.returnPrivateChats(this.selectedMember.id);
      return this.privateChats[this.selectedMember.id][messageType] || [];
    }
    return [];
  }

  /**
   * Sends a private message to a member
   */
  sendPrivateMsg() {
    const messageText = this.message.trim();
    const selectedFile = this.selectedFile;
    if ((selectedFile || messageText) && this.selectedMember) {
      const message = {
        userName: this.userService.getName(),
        profileImg: this.userService.getPhoto(),
        imageUrl: '',
        text: messageText,
        time: new Date().toLocaleTimeString(),
        reactions: [],
        answers: [],
      };
      const messageType = 'messagesMembers';

      if (selectedFile) {
        this.convertImageToBase64(selectedFile)
          .then((base64Data) => {
            message.imageUrl = base64Data;
            this.sharedService.savePrivateMessageToLocalStorage(
              this.selectedMember.id,
              message
            );
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        this.sharedService.savePrivateMessageToLocalStorage(
          this.selectedMember.id,
          message
        );
      }

      this.message = '';
      if (this.selectedFile) {
        this.selectedFile = null;
        this.clearPreviewImage();
      }
      this.loadPrivateChats();
      this.stopAutoScroll();
    }
  }

  /**
   * Searches in local storage
   */
  searchInLocalStorage(event: Event) {
    const searchText = (event.target as HTMLInputElement).value;
    if (searchText.startsWith('#')) {
      const searchTerm = searchText.slice(1);
      this.searchInChannels(searchTerm);
    } else if (searchText.startsWith('@')) {
      const searchTerm = searchText.slice(1);
      this.searchInMembers(searchTerm);
    } else {
      this.searchInChannels(searchText);
      this.searchInMembers(searchText);
    }
  }

  /**
   * Looks for a member in the list of members.
   * @returns the list of private messages
   */
  searchInMembers(searchTerm: string): string[] {
    this.memberMatches = [];
    const memberName = searchTerm.trim();
    if (memberName === '') {
      return [];
    }

    const members = this.sharedService.getMembers();
    const filteredMembers = members.slice(1);
    this.memberMatches = filteredMembers.filter((member) =>
      member.name.toLowerCase().includes(memberName.toLowerCase())
    );

    this.memberMatches.forEach((match) => {});

    return this.memberMatches.map((match) => match.name);
  }

  /**
   * Looks for a channel in the list of channels.
   * @returns the list of private messages
   */
  searchInChannels(searchTerm: string): string[] {
    this.channelMatches = [];
    const channelName = searchTerm.trim();
    if (channelName === '') {
      return [];
    }

    const channels = this.sharedService.getChannelsFromLS();
    this.channelMatches = channels.filter((channel) =>
      channel.name.toLowerCase().includes(channelName.toLowerCase())
    );

    this.channelMatches.forEach((match) => {});

    return this.channelMatches.map((match) => match.name);
  }
}

// /**
//  * Load the messages of the channels from local storage
//  */
// isChannelMessagesNotEmpty(): boolean {
//   if (this.isChannelVisible && this.selectedChannel) {
//     const channelId = this.selectedChannel.id;
//     const channelMessages = this.channelsMessages[channelId];
//     return (
//       !!channelMessages &&
//       ((channelMessages.messagesUser &&
//         channelMessages.messagesUser.length > 0) ||
//         (channelMessages.messagesMembers &&
//           channelMessages.messagesMembers.length > 0))
//     );
//   } else if (
//     (this.isChatWithMemberVisible && this.selectedMember) ||
//     (this.isPrivateChatVisible && this.selectedMember)
//   ) {
//     const memberId = this.selectedMember.id;
//     const privateChatMessages = this.privateChats[memberId];
//     return (
//       !!privateChatMessages &&
//       ((privateChatMessages.messagesUser &&
//         privateChatMessages.messagesUser.length > 0) ||
//         (privateChatMessages.messagesMembers &&
//           privateChatMessages.messagesMembers.length > 0))
//     );
//   }
//   return false;
// }

// getMessagesfromSelectedMember() {
//   const memberId = this.selectedMember ? this.selectedMember.id : '';
//   console.log('Member ID:', memberId);
//   const messageType = 'messagesUser';

//   if (!this.privateChats[memberId]) {
//     this.privateChats[memberId] = {
//       messagesUser: [],
//       messagesMembers: [],
//     };
//   }

//   // this.privateChats[memberId].messagesUser =
//   //   this.sharedService.getMessagesForPrivateChat(memberId, messageType);
//   // console.log(this.privateChats[memberId].messagesUser);
// }

// /**
//  * Scrolls to the bottom of the chat after the view is initialized
//  */
// ngAfterViewInit() {
//   this.scrollToBottom();
// }

// ngAfterViewChecked() {
//   this.scrollToBottom();
// }
