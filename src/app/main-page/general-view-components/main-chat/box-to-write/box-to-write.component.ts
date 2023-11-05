import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { onSnapshot } from '@angular/fire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { EmitOpenService } from 'src/app/services/emit-open.service';

@Component({
  selector: 'app-box-to-write',
  templateUrl: './box-to-write.component.html',
  styleUrls: ['./box-to-write.component.scss'],
})
export class BoxToWriteComponent implements OnInit {
  @ViewChild('messageTextarea') messageTextarea: ElementRef | undefined;
  @ViewChild('imagePreview', { read: ElementRef }) imagePreview: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;

  isFocused = false;
  taIsFocused: boolean = false;
  userChannel: boolean = false;
  searchResults: any[] = [];
  placeholderMessageBox = 'Starte eine neue Nachricht';
  message: string = '';
  imageLoaded: boolean = false;
  memberMatches: any[] = [];
  channelMatches: any[] = [];
  isNewMessageVisible = false;
  selectedMember: any;
  currentChannel: any;
  selectedFile: File | null = null;
  showEmojiPicker: boolean[] = [false, false];
  sendPrivate = false;
  sendChannel = false;
  selectedChannel: any;
  timeLineDisplayed: Date | null = null;
  currentChatData: any;
  autoScrollEnabled = true;
  showUser: boolean = false;
  users: DocumentData[] = [];
  data: any;

  private userHasWrittenAfterAt = false;
  private chatSubscription: Subscription = new Subscription();

  constructor(
    private sharedService: SharedService,
    private userService: UserService,
    private EmitOpenService: EmitOpenService
  ) {
    this.imagePreview = new ElementRef(null);
    this.openBoxForChannelAndChat(this.data);

    this.openNewMessage();
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.chatSubscription.unsubscribe();
  }

  /**
   * Opens the channel container
   * @param channel the channel to open
   */
  openBoxForChannelAndChat(data: any) {
    this.EmitOpenService.OpenBoxToWrite$.subscribe((receivedData: any) => {
      const channel = receivedData.channel;
      const member = receivedData.member;
      if (channel) {
        this.selectedChannel = channel;
        this.currentChannel = channel;
        this.getMessages(channel);
        this.sendChannel = true;
        this.sendPrivate = false;
        this.currentChatData = false;
        this.placeholderMessageBox = 'Nachricht an #' + channel?.name;
      } else if (member) {
        this.selectedMember = '';
        this.currentChatData = true;
        this.selectedMember = member;
        this.sendPrivate = true;
        this.sendChannel = false;
        this.placeholderMessageBox = 'Nachricht an ' + member.name;
        this.getsPrivateChats();
      }
    });
  }

  getMessages(channel: any) {
    return onSnapshot(this.sharedService.getChannelsFromFS(), (list: any) => {
      this.selectedChannel = [];
      list.forEach((element: any) => {
        const channelData = element.data();
        if (channelData.name === channel?.name) {
          this.selectedChannel = channelData;
          this.selectedChannel.id = channel.id;
        }
      });
    });
  }

  getsPrivateChats() {
    this.chatSubscription = this.userService
      .subToChosenChat()
      .subscribe((chatData) => {
        this.currentChatData = chatData;
      });
  }

  openNewMessage() {
    this.EmitOpenService.openNewMessageEvent$.subscribe(() => {
      this.sendPrivate = false;
      this.sendChannel = false;
      this.currentChatData = false;
      this.selectedChannel = null;
      this.currentChannel = null;
      this.selectedMember = null;
      this.placeholderMessageBox = 'Starte eine neue Nachricht';
    });
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
   * Changes the color of the input when it is focused
   */
  inputFocused() {
    this.isFocused = true;
  }

  insertName(member: any) {
    //   if (this.messageTextarea && this.messageTextarea.nativeElement) {
    //     const currentText = this.messageTextarea.nativeElement.value;
    //     const textBeforeLastAt = currentText.substring(
    //       0,
    //       currentText.lastIndexOf('@')
    //     );
    //     const newText = `${textBeforeLastAt}@${member.name}`;
    //     this.messageTextarea.nativeElement.value = newText;
    //     this.message = newText;
    //   }
    //   this.userChannel = false;
    // }
  }
  /**
   * Checks if the user has written after the @ and regulaces the height of the textarea
   * @param event the event
   */
  onTextareaInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = '40px';
    target.style.height = target.scrollHeight + 'px';

    const messageContent = target.value;

    if (
      messageContent &&
      messageContent.includes('@') &&
      messageContent.length > 1
    ) {
      this.userHasWrittenAfterAt = true;
      this.searchMembersChannel();
      this.userChannel = true;
    } else {
      this.userChannel = false;
    }
  }

  /**
   * Searches for a member for the chat
   */
  searchMembersChannel() {
    if (this.userHasWrittenAfterAt) {
      if (this.messageTextarea && this.messageTextarea.nativeElement) {
        const inputText = this.messageTextarea.nativeElement.value;
        this.memberMatches = [];
        this.channelMatches = [];

        const searchTerm = inputText.substring(inputText.lastIndexOf('@') + 1);
        this.searchMembers(searchTerm).then((members) => {
          this.memberMatches = members;
          this.isNewMessageVisible =
            this.memberMatches.length > 0 || this.channelMatches.length > 0;
          this.searchResults = this.memberMatches;
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
   * Removes the image selected
   */
  removeFileSelected() {
    this.imageLoaded = false;
    this.selectedFile = null;
    this.clearPreviewImage();
  }

  /**
   * Clears the preview image
   */
  clearPreviewImage() {
    const previewImg = this.imagePreview?.nativeElement;
    if (previewImg) {
      previewImg.src = '';
      this.imageLoaded = false;
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
    }
  }

  /**
   * Charges an image and shows it in the preview
   */
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    const previewImg = this.imagePreview?.nativeElement;

    if (this.selectedFile && previewImg) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const imgSrc = e.target.result as string;
          if (this.currentChannel || this.selectedMember) {
            if (previewImg) {
              previewImg.onload = () => {
                previewImg.src = imgSrc;
                this.imageLoaded = true;
              };
              previewImg.src = imgSrc;
            }
          }
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
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

  // /**
  //  * Send a @ to the textarea to look for a member
  //  */
  // writeUser() {
  //   if (this.messageTextarea && this.messageTextarea.nativeElement) {
  //     this.messageTextarea.nativeElement.value += '@';
  //     this.userHasWrittenAfterAt = false;
  //   }
  // }
  showUsers() {
    this.showUser = !this.showUser;
    console.log('showUser', this.showUser);
  }

  // getUserCollection() {
  //   return collection(this.firestore, 'users');
  // }

  // loadUsers() {
  //   return onSnapshot(this.getUserCollection(), (list) => {
  //     list.forEach((element) => {
  //       const userData = element.data();
  //       this.users.push(userData);
  //     });
  //     console.log('userdaten', this.users);
  //   });
  // }

  addUser(name: string) {
    this.message += '#' + name;
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
    const messageDate = new Date(message.date);
    if (
      !this.timeLineDisplayed ||
      messageDate.toDateString() !== this.timeLineDisplayed.toDateString()
    ) {
      this.timeLineDisplayed = messageDate;
    }
    this.returnChannelsMessages();
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
  }

  returnPrivatesMessagesFS() {
    this.selectedMember.chat = this.userService.subToChosenChat();
  }
}
