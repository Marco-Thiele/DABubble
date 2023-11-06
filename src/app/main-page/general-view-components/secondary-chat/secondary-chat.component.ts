import { DialogService } from '../../../services/dialog.service';
import { UserService } from '../../../services/user.service';
import { UserProfilComponent } from '../../profils-components/user-profil/user-profil.component';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChannelEditComponent } from '../../channels-components/channel-edit/channel-edit.component';
import { SharedService } from '../../../services/shared.service';
import { ChannelMembersComponent } from '../../channels-components/channel-members/channel-members.component';
import { AddChannelMembersComponent } from '../../channels-components/add-channel-members/add-channel-members.component';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { object } from 'rxfire/database';
import { user } from 'rxfire/auth';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { EmitOpenService } from 'src/app/services/emit-open.service';

@Component({
  selector: 'app-secondary-chat',
  templateUrl: './secondary-chat.component.html',
  styleUrls: ['./secondary-chat.component.scss'],
})
export class SecondaryChatComponent {
  @ViewChild('imagePreviewCont') imagePreviewCont: ElementRef | undefined;
  @ViewChild('imagePreview') imagePreview: ElementRef | undefined;
  @ViewChild('chatContainer') chatContainer: ElementRef | undefined;

  profilName: string;
  profilImg: any;
  profilEmail: string;
  i: any;
  j: number = 0;
  showIconCatalog = false;
  name = 'Angular';
  message = '';
  messageThrad: {} = {};
  existEmoji: boolean = false;
  threads = {
    id: '',
    userName: '',
    profileImg: '',
    imageUrl: '',
    text: '',
    time: '',
    reactions: [],
    answers: [],
    date: '',
    email: '',
  };
  threadAnswersJson: [] = [];
  editMessageUser: boolean[] = [false, false];
  editedMessageUser: string = '';
  threadAnswers = {
    id: '',
    userName: '',
    profileImg: '',
    imageUrl: '',
    text: '',
    time: '',
    reactions: '',
    date: '',
  };
  emojis = {
    userName: [],
    emoji: '',
  };
  newReacktion = {
    count: 1,
    users: [],
    emoji: '',
  };
  allgemeinChannelId = 'F4IP13XBHg4DmwEe4EPH';
  messageID: any;
  thread: any;
  showEmojiPicker: boolean[] = [false, false];
  showDelete: boolean[] = [false, false];
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
  sameName: boolean = false;
  messageBox = true;
  sendPrivate = false;
  sendChannel = false;
  memberMatches: any[] = [];
  channelMatches: any[] = [];
  channelsIds: { [channelId: string]: any[] } = {};
  firestore: Firestore = inject(Firestore);
  showUser: boolean = false;
  users: DocumentData[] = [];

  constructor(
    private dialogService: DialogService,
    public UserService: UserService,
    public sharedService: SharedService,
    private EmitOpenService: EmitOpenService
  ) {
    this.profilName = UserService.getName();
    this.profilImg = UserService.getPhoto();
    this.profilEmail = UserService.getMail();
    this.readThread();
    this.loadUsers();
    this.subscribeToChat();
  }

  /**
   * get the data from shared.Service
   */
  async readThread() {
    setInterval(() => {
      if (this.EmitOpenService.openThread) {
        this.i = this.sharedService.i;
        // this.threadAnswersJson = this.sharedService.thread.answers;
        this.readThreadObject();
        //this.selectedChannel = this.sharedService.selectedChannel;
      }
      this.EmitOpenService.openThread = false;
      setTimeout(() => {
        this.EmitOpenService.openThread = true;
      }, 150);
    }, 200);
  }

  subscribeToChat() {
    this.EmitOpenService.openChannelEvent$.subscribe((channel: any) => {
      this.getMessages(channel);
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

          this.threadAnswersJson =
            channelData.chat[this.sharedService.i]['answers'];
          console.log('channeldata', this.threadAnswersJson);
        }
      });
    });
  }

  /**
   * load the variable threads shared.Service
   */
  readThreadObject() {
    this.threads = {
      id: this.sharedService.thread.id,
      userName: this.sharedService.thread.userName,
      profileImg: this.sharedService.thread.profileImg,
      imageUrl: '',
      text: this.sharedService.thread.text,
      time: this.sharedService.thread.time,
      reactions: this.sharedService.thread.reactions,
      answers: this.sharedService.thread.answers,
      date: this.sharedService.thread.date,
      email: this.sharedService.thread.email,
    };
  }

  /**
   * shows the userprofil
   *
   * @param userName string
   * @param userPhotoURL string
   * @param userEmail string
   */
  showUserProfil(userName: string, userPhotoURL: string, userEmail: string) {
    this.UserService.selectedUserName = userName;
    this.UserService.selectedUserPhotoURL = userPhotoURL;
    this.UserService.selectedUserEmail = userEmail;
    this.dialogService.openDialog(UserProfilComponent);
  }

  ngOnInit(): void {}

  /**
   * Opens the new message component which is used to create a new channel or to start a new chat with a member
   */
  // openNewMessage() {
  //   this.EmitOpenService.openNewMessageEvent$.subscribe(() => {
  //     this.isNewMessageVisible = true;
  //     this.isChannelVisible = false;
  //     this.isChatWithMemberVisible = false;
  //     this.isPrivatChatContainerVisible = false;
  //     this.isPrivatChatContainerVisible = false;
  //     this.isPrivateChatVisible = false;
  //   });
  // }

  /**
   * change the size from the textarea
   *
   * @param event any : click in the textarea
   */
  onTextareaInput(event: any): void {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = '40px';
    target.style.height = target.scrollHeight + 'px';
  }

  /**
   * Charges an image and shows it in the preview
   */
  onFileSelected(event: any): void {
    const selectedFile = event.target.files[0];
    const previewCont = this.imagePreviewCont?.nativeElement;
    const previewImg = this.imagePreview?.nativeElement;
    if (selectedFile && previewCont && previewImg) {
      previewCont.style.display = 'flex';
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          previewImg.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  /**
   * Show the emoji picker
   */
  toggleEmojiPicker(index: number) {
    this.showEmojiPicker[index] = !this.showEmojiPicker[index];
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
   * add an emoji to the headtext in threads
   *
   * @param event any : selected emoji
   */
  addEmojiThread(event: any) {
    let answersEmojis = this.selectedChannel.chat[this.i].reactions;
    this.existEmoji = false;
    const { message } = this;
    const text = `${message}${event.emoji.native}`;
    this.addEmojiThreadForEach(answersEmojis, text);
    this.addEmojiThreadAnswerIfNotExist(text);
    this.sharedService.updateChannelFS(this.selectedChannel);
    this.showEmojiPicker[-1] = false;
    this.j = 0;
  }

  /**
   * searched if the emoji exist and if the user has it picked bevor
   *
   * @param answersEmojis any : data path
   * @param text string : selected emoji
   */
  addEmojiThreadForEach(answersEmojis: any, text: string) {
    answersEmojis.forEach((element: any) => {
      this.j++;
      if (element.emoji.includes(text)) {
        if (!element.users.includes(this.UserService.getName())) {
          element.users.push(this.UserService.getName());
          element.count++;
        }
        this.existEmoji = true;
      }
    });
  }

  /**
   * if the emoji do not exist it while be saved
   *
   * @param text string : selected emoji
   */
  addEmojiThreadAnswerIfNotExist(text: string) {
    if (!this.existEmoji) {
      this.newReacktion = {
        count: 1,
        users: [],
        emoji: text,
      };
      this.selectedChannel.chat[this.i].reactions.push(this.newReacktion);
      this.selectedChannel.chat[this.i].reactions[this.j].users.push(
        this.UserService.getName()
      );
    }
  }

  deleteEmojiThread(j: number) {
    let answersEmojis = this.selectedChannel.chat[this.i].reactions[j];
    this.deleteEmojisThreadIf(answersEmojis, j);
    this.sharedService.updateChannelFS(this.selectedChannel);
  }

  deleteEmojisThreadIf(answersEmojis: any, j: number) {
    if (answersEmojis.users.includes(this.UserService.getName())) {
      let deleteName = this.UserService.getName();
      let newUsernames = answersEmojis.users.filter(
        (item: any) => item !== deleteName
      );
      answersEmojis.users = newUsernames;
      answersEmojis.count--;
      if (answersEmojis.users.length == 0)
        this.selectedChannel.chat[this.i].reactions.splice(j, 1);
    } else {
      this.selectedChannel.chat[this.i].reactions[j].users.push(
        this.UserService.getName()
      );
      this.selectedChannel.chat[this.i].reactions[j].count++;
    }
  }

  addEmojiAnswer(event: any, i: number) {
    let answersEmojis = this.selectedChannel.chat[this.i].answers[i].reactions;
    this.existEmoji = false;
    const { message } = this;
    const text = `${message}${event.emoji.native}`;
    this.addEmojiAnswerForEach(answersEmojis, text);
    this.addEmojiAnswerIfNotExist(text, i);
    this.sharedService.updateChannelFS(this.selectedChannel);
    this.showEmojiPicker[i] = false;
    this.j = 0;
  }

  addEmojiAnswerForEach(answersEmojis: any, text: string) {
    answersEmojis.forEach((element: any) => {
      this.j++;
      if (element.emoji.includes(text)) {
        if (!element.userName.includes(this.UserService.getName())) {
          element.userName.push(this.UserService.getName());
        }
        this.existEmoji = true;
      }
    });
  }

  addEmojiAnswerIfNotExist(text: string, i: number) {
    if (!this.existEmoji) {
      this.emojis = {
        userName: [],
        emoji: text,
      };
      this.selectedChannel.chat[this.i].answers[i].reactions.push(this.emojis);
      this.selectedChannel.chat[this.i].answers[i].reactions[
        this.j
      ].userName.push(this.UserService.getName());
    }
  }

  deleteEmoji(i: number, j: number) {
    let answersEmojis =
      this.selectedChannel.chat[this.i].answers[i].reactions[j];
    this.deleteEmojisIf(answersEmojis, i, j);
    this.sharedService.updateChannelFS(this.selectedChannel);
  }

  deleteEmojisIf(answersEmojis: any, i: number, j: number) {
    if (answersEmojis.userName.includes(this.UserService.getName())) {
      let deleteName = this.UserService.getName();
      let newUsernames = answersEmojis.userName.filter(
        (item: any) => item !== deleteName
      );
      answersEmojis.userName = newUsernames;
      if (answersEmojis.userName.length == 0)
        this.selectedChannel.chat[this.i].answers[i].reactions.splice(j, 1);
    } else {
      this.selectedChannel.chat[this.i].answers[i].reactions[j].userName.push(
        this.UserService.getName()
      );
    }
  }

  toggleShowDelete(index: number) {
    this.showDelete[index] = !this.showDelete[index];
  }

  /**
   * Changes the color in input when it is focused
   */
  inputFocused() {
    this.isFocused = true;
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
   * Scrolls to the bottom of the chat
   */
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  /**
   * Scrolls to the bottom of the chat
   */
  scrollToBottom() {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    }
  }

  /**
   * Sends a message to the channel
   */
  async sendChannelMsg() {
    const messageText = this.message.trim();
    this.messageThrad = {
      userName: this.UserService.getName(),
      text: messageText,
      time: new Date().toLocaleTimeString(),
      reactions: [],
      date: new Date().toLocaleDateString(),
      profileImg: this.UserService.getPhoto(),
      email: this.UserService.getMail(),
    };
    this.selectedChannel.chat[this.i].answers.push(this.messageThrad);
    this.sharedService.updateChannelFS(this.selectedChannel);
    this.message = '';
  }

  /**
   * Closes the thread container
   */
  closeThreads(channel: any) {
    if (innerWidth < 1000) {
      this.EmitOpenService.emitRespCloseThreads(channel);
      this.EmitOpenService.emitRespOpenChannel(channel);
      this.EmitOpenService.emitOpenChannel(channel);
    }
    this.EmitOpenService.closeThreads(channel);
  }

  deleteMessage(i: number) {
    this.selectedChannel.chat[this.i].answers.splice(i, 1);
    this.sharedService.updateChannelFS(this.selectedChannel);
  }

  closeEdit(i: number) {
    this.editMessageUser[i] = false;
  }

  editMessage(i: number, messageID: any) {
    this.editMessageUser[i] = true;
  }

  saveEditMessage(i: number) {
    if (this.selectedChannel) {
      const editedMessage = this.selectedChannel.chat[this.i].answers[i];
      editedMessage.text = this.editedMessageUser;
      editedMessage.edited = true;
      this.sharedService.updateChannelFS(this.selectedChannel);
    }
    this.editMessageUser[i] = false;
  }

  getUserCollection() {
    return collection(this.firestore, 'users');
  }

  showUsers() {
    this.showUser = !this.showUser;
  }

  loadUsers() {
    return onSnapshot(this.getUserCollection(), (list) => {
      list.forEach((element) => {
        const userData = element.data();
        this.users.push(userData);
      });
    });
  }

  addUser(name: string) {
    this.message += '#' + name;
  }
}
