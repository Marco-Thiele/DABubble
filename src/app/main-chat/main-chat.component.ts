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
import { Router } from '@angular/router';
import { UserProfilComponent } from '../user-profil/user-profil.component';
import { DialogService } from '../dialog.service';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { user } from 'rxfire/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss'],
})
export class MainChatComponent implements OnInit {
  @ViewChild('imagePreviewCont', { read: ElementRef })
  imagePreviewCont: ElementRef;
  @ViewChild('imagePreview', { read: ElementRef }) imagePreview: ElementRef;
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @ViewChild('membersContainer', { static: false })
  membersContainer!: ElementRef;

  name = 'Angular';
  message: string = '';
  imageLoaded: boolean = false;
  showEmojiPicker: boolean[] = [false, false];
  existEmoji: boolean = false;
  emojis = {
    userName: [],
    emoji: '',
  };
  i: any;
  j: number = 0;
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
    [channelId: string]: { chat: any[] };
  } = {};
  privateChats: {
    [memberId: string]: { chat: any[] };
  } = {};
  members: any[] = [];
  selectedFile: File | null = null;
  containerChat: any;
  privateChatMessages: any[] = [];
  autoScrollEnabled = true;
  memberName: string = '';
  channelName: string = '';
  inputText: string = '';
  inputValue: string = '';
  showContainers: boolean = true;
  foundUsers: DocumentData[] = [];
  showEdit: boolean[] = [false, false];
  editMessageUser: boolean[] = [false, false];
  editedMessageUser: string = '';
  currentChatData: any;
  reactions: any;
  userReactions: Record<string, Record<string, boolean>> = {};

  private chatSubscription: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private sharedService: SharedService,
    public userService: UserService,
    public router: Router,
    private dialogService: DialogService
  ) {
    this.openNewMessage();
    this.loadChannel();
    this.openChannelContainer(this.selectedChannel);
    this.openPrivateContainerMessage(this.selectedMember);
    this.imagePreviewCont = new ElementRef(null);
    this.imagePreview = new ElementRef(null);
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.chatSubscription.unsubscribe();
  }

  /**
   * It is executed when the view is initialized
   */
  ngAfterViewChecked() {
    if (this.autoScrollEnabled) {
      this.scrollToBottom();
    }
  }

  /**
   * It is executed when the user scrolls
   */
  handleScroll(event: Event) {
    const chatElement = this.chatContainer.nativeElement;
    this.autoScrollEnabled =
      chatElement.scrollHeight - chatElement.scrollTop ===
      chatElement.clientHeight;
  }

  /**
   * Scrolls to the bottom of the chat
   */
  scrollToBottom() {
    if (
      (this.isChatWithMemberVisible &&
        this.currentChatData &&
        this.selectedMember) ||
      (this.isChannelVisible && this.selectedChannel) ||
      (this.isPrivateChatVisible && this.selectedMember && this.currentChatData)
    ) {
      const chatElement = this.chatContainer.nativeElement;
      chatElement.scrollTop = chatElement.scrollHeight;
    }
  }

  scrollToTop() {
    if (this.membersContainer) {
      const containerElement = this.membersContainer.nativeElement;
      containerElement.scrollTop = 0;
    }
  }

  /**
   * Opens the new message component which is used to create a new channel or to start a new chat with a member
   */
  openNewMessage() {
    this.sharedService.openNewMessageEvent$.subscribe(() => {
      this.showContainers = true;
      this.isNewMessageVisible = true;
      this.isChannelVisible = false;
      this.isChatWithMemberVisible = false;
      this.isPrivatChatContainerVisible = false;
      this.isPrivatChatContainerVisible = false;
      this.isPrivateChatVisible = false;
      this.selectedChannel = null;
      this.currentChatData = false;
      this.selectedMember = null;
      this.sendPrivate = false;
      this.placeholderMessageBox = 'Starte eine neue Nachricht';
      this.scrollToTop();
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
      this.currentChatData = false;
      this.sendChannel = true;
      this.sendPrivate = false;
      this.placeholderMessageBox = 'Nachricht an #' + channel.name;
      this.scrollToBottom();
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
    this.currentChatData = false;
    this.placeholderMessageBox = 'Nachricht an ' + member.name;
    this.scrollToBottom();
  }

  /**
   * Sets the variables for a private chat with a member
   * @param member
   */
  privateChatWithMember(member: any) {
    this.isPrivatChatContainerVisible = true;
    this.isChatWithMemberVisible = true;
    this.currentChatData = true;
    this.isPrivateChatVisible = false;
    this.isChannelVisible = false;
    this.isNewMessageVisible = false;
    this.selectedMember = member;
    this.selectedChannel = null;
    this.sendPrivate = true;
    this.sendChannel = false;
    this.placeholderMessageBox = 'Nachricht an ' + member.name;
    this.getsPrivateChats();
    this.scrollToBottom();
  }

  getsPrivateChats() {
    this.chatSubscription = this.userService
      .subToChosenChat()
      .subscribe((chatData) => {
        this.currentChatData = chatData;
      });
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
    const channels = this.sharedService.getChannelsFromFS();
    if (channels) {
      this.isNewMessageVisible = true;
      this.isChannelVisible = false;
    } else {
      this.selectChannel(channels);
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
    const dialogRef = this.dialog.open(ChannelEditComponent, {
      data: { selectedChannel },
    });
    this.sharedService.setIsEditChannelOpen(true);

    dialogRef.afterClosed().subscribe(() => {
      this.sharedService.setIsEditChannelOpen(false);
    });
  }

  /**
   * Opens a channel and closes the new message component
   * @param channel the channel to open
   */
  openChannel(channel: any) {
    this.selectedChannel = channel;
    const channelId = channel.id;
    this.sharedService.emitOpenChannel(channel);
    this.inputValue = '';
  }

  /**
   * Opens a private chat with a member and closes the new message component
   * @param member the member to open
   */
  openPrivateContainer(member: any) {
    this.selectedMember = member;
    const memberId = member.id;
    this.userService.selectedChatPartner = member;

    this.userService.doesChatExist();
    this.userService.createChat();
    this.userService.chatAlreadyExists = false;
    this.sharedService.emitOpenPrivateContainer(member);
    this.inputValue = '';
    this.showContainers = false;
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
  toggleEmojiPicker(index: number) {
    this.showEmojiPicker[index] = !this.showEmojiPicker[index];
  }

  /**
   * Add the emoji that the user has selected
   */
  addEmoji(event: any) {
    const text = `${this.message}${event.emoji.native}`;
    this.message = text;
  }

  /**
   * Add an emoji to the message
   */
  addEmojiAnswer(event: any, i: number) {
    const { message } = this;
    const text = `${message}${event.emoji.native}`;

    if (this.selectedChannel) {
      let reactions = this.selectedChannel.chat[i].reactions;
      this.addEmojiAnswerForEach(reactions, text);
      this.addEmojiAnswerIfNotExist(reactions, text, i, true);
      this.sharedService.updateChannelFS(this.selectedChannel);
    } else if (this.currentChatData) {
      let reactions = this.currentChatData.chat[i].reactions;
      this.addEmojiAnswerForEach(reactions, text);
      this.addEmojiAnswerIfNotExist(reactions, text, i, false);
      this.sharedService.updatePrivateChatFS(this.selectedMember);
    }

    this.showEmojiPicker[i] = false;
    this.j = 0;
  }

  /**
   * Add an emoji that the user has selected and updates the database
   * @param reactions the reactions of the message
   * @param text the emoji to add
   */
  addEmojiAnswerForEach(reactions: any[], text: string) {
    let currentUser = this.userService.getName();
    let reaction = reactions.find((r) => r.emoji === text);

    if (reaction) {
      if (!reaction.users.includes(currentUser)) {
        reaction.users.push(currentUser);
        reaction.count++;
      }
    }
  }

  /**
   * Add an emoji that the user has selected and updates the database
   * @param reactions the reactions of the message
   * @param text the emoji to add
   * @param i the index of the message
   * @param isChannel true if the message is from a channel, false otherwise
   */
  addEmojiAnswerIfNotExist(
    reactions: any[],
    text: string,
    i: number,
    isChannel: boolean
  ) {
    if (!reactions.some((r) => r.emoji === text)) {
      const newReaction = {
        emoji: text,
        users: [this.userService.getName()],
        count: 1,
      };

      reactions.push(newReaction);
    }
  }

  /**
   * Deletes an emoji from the message
   * @param i the index of the message
   * @param j the index of the emoji
   * @returns true if the emoji has been deleted, false otherwise
   */
  deleteEmoji(i: number, j: number) {
    let chatObject;
    let isChannel = false;

    if (this.selectedChannel) {
      chatObject = this.selectedChannel;
      isChannel = true;
    } else if (this.currentChatData) {
      chatObject = this.currentChatData;
    } else {
      return;
    }

    const reactions = chatObject.chat[i].reactions;
    const emojiReaction = reactions[j];
    const currentUser = this.userService.getName();

    if (emojiReaction.users.includes(currentUser)) {
      emojiReaction.count--;
      emojiReaction.users.splice(emojiReaction.users.indexOf(currentUser), 1);
      if (emojiReaction.count === 0) {
        const userIndex = emojiReaction.users.indexOf(currentUser);
        emojiReaction.users.splice(userIndex, 1);
        reactions.splice(j, 1);
      }
    } else {
      emojiReaction.users.push(currentUser);
      emojiReaction.count++;
    }

    if (isChannel) {
      this.sharedService.updateChannelFS(chatObject);
    } else {
      this.sharedService.updatePrivateChatFS(chatObject);
    }
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
        uid: this.userService.getId(),
        id: Date.now(),
        userName: this.userService.getName(),
        profileImg: this.userService.getPhoto(),
        imageUrl: '',
        text: messageText,
        time: new Date().toLocaleTimeString(),
        reactions: [],
        answers: [],
        date: new Date().toLocaleDateString(),
        email: this.userService.getMail(),
      };
      if (selectedFile) {
        this.convertImageToBase64(selectedFile).then((base64Data) => {
          message.imageUrl = base64Data;
          this.saveMessage(message, this.currentChannel);
        });
      } else {
        this.saveMessage(message, this.currentChannel);
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
    this.scrollToBottom();
  }

  /**
   * Removes the image selected
   */
  removeFileSelected() {
    this.imageLoaded = false;
    this.selectedFile = null;
    this.clearPreviewImage();
  }

  /**
   * Saves a message to local storage
   * @param message message from user
   * @param messageDate date of message
   */
  saveMessage(message: any, channelOrMember: any) {
    this.selectedChannel.chat.push(message);
    this.sharedService.updateChannelFS(this.selectedChannel);

    this.message = '';
    if (this.selectedFile) {
      this.selectedFile = null;
      this.clearPreviewImage();
    }
    this.returnChannelsMessages();
    this.scrollToBottom();
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
      this.containerChat.style.maxHeight = '100%';
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
    }
  }

  /**
   * Returns the messages of the channels from server
   */
  returnChannelsMessages() {
    this.sharedService.ChannelChatList(this.selectedChannel);
  }

  /**
   * Sends a private message to a member
   */
  sendPrivateMsg() {
    const messageText = this.message.trim();
    this.userService.messageText = this.message;
    const selectedFile = this.selectedFile;
    if ((selectedFile || messageText) && this.selectedMember) {
      const message = this.userService.privateMessage();

      if (selectedFile) {
        this.convertImageToBase64(selectedFile).then((base64Data) => {
          message.imageUrl = base64Data;
          this.savePrivateMessage(this.selectedMember, message);
        });
      } else {
        this.savePrivateMessage(this.selectedMember, message);
      }
    }
  }

  savePrivateMessage(selectedMember: any, message: any) {
    this.userService.currentChat.chat.push(message);

    this.sharedService.updatePrivateChatFS(selectedMember);

    this.message = '';
    if (this.selectedFile) {
      this.selectedFile = null;
      this.clearPreviewImage();
    }
    this.returnPrivatesMessagesFS();
    this.scrollToBottom();
  }

  returnPrivatesMessagesFS() {
    this.selectedMember.chat = this.userService.subToChosenChat();
  }

  /**
   * Searches in local storage
   */
  searchMembersAndChannels(event: Event) {
    const inputText = (event.target as HTMLInputElement).value;

    if (typeof inputText === 'string') {
      this.memberMatches = [];
      this.channelMatches = [];

      if (inputText.startsWith('@')) {
        const searchTerm = inputText.substring(1);
        this.searchMembers(searchTerm).then((members) => {
          this.memberMatches = members;
          this.isNewMessageVisible =
            this.memberMatches.length > 0 || this.channelMatches.length > 0;
          if (this.isNewMessageVisible) {
            this.scrollToTop();
          }
        });
      } else if (inputText.startsWith('#')) {
        const searchTerm = inputText.substring(1);
        this.searchChannels(searchTerm).then((channels) => {
          this.channelMatches = channels;
          this.isNewMessageVisible =
            this.memberMatches.length > 0 || this.channelMatches.length > 0;
          if (this.isNewMessageVisible) {
            this.scrollToTop();
          }
        });
      } else {
        this.searchMembers(inputText).then((members) => {
          this.memberMatches = members;
          this.isNewMessageVisible =
            this.memberMatches.length > 0 ||
            this.channelMatches.length > 0 ||
            this.isNewMessageVisible === true;
          if (this.isNewMessageVisible) {
            this.scrollToTop();
          }
        });
        this.searchChannels(inputText).then((channels) => {
          this.channelMatches = channels;
          this.isNewMessageVisible =
            this.memberMatches.length > 0 ||
            this.channelMatches.length > 0 ||
            this.isNewMessageVisible === true;
          if (this.isNewMessageVisible) {
            this.scrollToTop();
          }
        });
      }
    }
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
   * Opens the threads container
   * @param member the member to open
   */
  openThread(i: number, messageID: any) {
    if (window.innerWidth < 1000) {
      this.sharedService.emitRespOpenThreadsEvent();
    }
    this.sharedService.selectedChannel = this.selectedChannel;
    this.sharedService.i = i;
    this.sharedService.messageID = messageID;
    this.sharedService.loadThreads();
    this.sharedService.openThread = true;
    this.sharedService.openThreads();
  }

  showUserProfil(
    userName: string,
    userPhotoURL: string,
    userEmail: string,
    userUID: string
  ) {
    this.userService.selectedUserName = userName;
    this.userService.selectedUserPhotoURL = userPhotoURL;
    this.userService.selectedUserEmail = userEmail;
    this.userService.selectedUserUid = userUID;
    this.dialogService.openDialog(UserProfilComponent);
  }

  // Alen Tests

  // onSearch(event: Event) {
  //   this.foundUsers = [];
  //   const input = (event.target as HTMLInputElement).value;
  //   this.userService.usersList.forEach((user) => {
  //     if (user['name'].toLowerCase().includes(input.toLowerCase())) {
  //       this.foundUsers.push(user);
  //     }
  //   });

  //   this.showResults = true;
  //   if (input.length === 0) {
  //     this.showResults = false;
  //   }
  // }

  /**
   * Shows the buttons for editing a message
   * @param i the index of the message
   */
  toggleShowEdit(i: number) {
    this.showEdit[i] = !this.showEdit[i];
  }

  /**
   * Opens the edit message component
   * @param i the index of the message
   * @param messageID the id of the message
   */
  editMessage(i: number, messageID: any) {
    this.editMessageUser[i] = true;
    this.sharedService.selectedChannel = this.selectedChannel;

    this.sharedService.i = i;
    this.sharedService.messageID = messageID;
  }

  /**
   * Closes the edit message component
   * @param i the index of the message
   */
  closeEdit(i: number) {
    this.editMessageUser[i] = false;
  }

  /**
   * Saves the edited message
   * @param i the index of the message
   */
  saveEditMessage(i: number) {
    if (this.currentChannel) {
      const editedMessage = this.currentChannel.chat[i];
      editedMessage.text = this.editedMessageUser;
      editedMessage.edited = true;
      this.sharedService.updateChannelFS(this.selectedChannel);
    } else if (this.currentChatData) {
      const editedMessage = this.userService.currentChat.chat[i];
      editedMessage.text = this.editedMessageUser;
      editedMessage.edited = true;
      this.sharedService.updatePrivateChatFS(this.currentChatData);
    }
    this.editMessageUser[i] = false;
  }
}
