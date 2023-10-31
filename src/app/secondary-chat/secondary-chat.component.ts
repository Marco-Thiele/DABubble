import { DialogService } from '../dialog.service';
import { UserService } from '../user.service';
import { UserProfilComponent } from '../user-profil/user-profil.component';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChannelEditComponent } from '../channel-edit/channel-edit.component';
import { SharedService } from '../shared.service';
import { ChannelMembersComponent } from '../channel-members/channel-members.component';
import { AddChannelMembersComponent } from '../add-channel-members/add-channel-members.component';
import {
  Firestore,
  collection,
  query,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  where,
  QuerySnapshot,
  arrayUnion,
} from '@angular/fire/firestore';
import { object } from 'rxfire/database';
import { user } from 'rxfire/auth';

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

  constructor(
    private dialogService: DialogService,
    public UserService: UserService,
    public sharedService: SharedService
  ) {
    this.profilName = UserService.getName();
    this.profilImg = UserService.getPhoto();
    this.profilEmail = UserService.getMail();

    this.readThread();
    // this.openNewMessage();
    console.log(this.showEmojiPicker);
  }

  async readThread() {
    setInterval(() => {
      if (this.sharedService.openThread) {
        this.i = this.sharedService.i;
        this.threadAnswersJson = this.sharedService.thread.answers;
        // console.log('threadAnswers',  this.threadAnswersJson);
        // console.log('i', this.i)
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

        this.selectedChannel = this.sharedService.selectedChannel;
      }
      this.sharedService.openThread = false;
      setTimeout(() => {
        this.sharedService.openThread = true;
      }, 150);
    }, 200);
    // const answers = this.sharedService.getsingleDocRef(
    //   'channels',
    //   this.allgemeinChannelId
    // );
    // const channelSnapshot = await getDoc(answers);
    // this.sharedService.getChannelsFS();
    // console.log('answers', channelSnapshot.data());
    // console.log('answers2', this.sharedService.getChannelsFS());

    // const q = query(collection(this.firestore, 'channels'), where('answers.id', '==', 1697695581740));
    // const unsubscribe = onSnapshot(q,(querySnapshot) => {
    //   console.log('was ist das', querySnapshot);

    //   querySnapshot.forEach((doc) => {
    //   console.log( 'was ist das ', doc)
    // });
    // })

    // return onSnapshot(collection(this.firestore, 'channels'), (list) => {
    //   list.forEach((element) => {
    //     if (element.id == this.allgemeinChannelId && element) {
    //       const gameData = element.data();
    //       console.log('gamedata', gameData['chat'][0]);
    //       this.thread = gameData['chat'][0];

    //       // this.game.currentPlayer = gameData['currentPlayer'];
    //       // this.game.players = gameData['players'];
    //       // this.game.player_images = gameData['player_images'];
    //       // this.game.playedCards = gameData['playedCards'];
    //       // this.game.stack = gameData['stack'];
    //       // this.game.pickCardAnimation = gameData['pickCardAnimation'];
    //       // this.game.currentCard = gameData['currentCard'];
    //       this.threads = {
    //         id: this.thread.id,
    //         userName: this.thread.userName,
    //         profileImg: this.thread.profileImg,
    //         imageUrl: '',
    //         text: this.thread.text,
    //         time: this.thread.time,
    //         reactions: this.thread.reactions,
    //         answers: this.thread.answers,
    //         date: this.thread.date,
    //       };
    //       console.log('threads', this.threads);
    // }
    //   });
    // });
  }

  showUserProfil(userName: string, userPhotoURL: string, userEmail: string) {
    this.UserService.selectedUserName = userName;
    this.UserService.selectedUserPhotoURL = userPhotoURL;
    this.UserService.selectedUserEmail = userEmail;
    this.dialogService.openDialog(UserProfilComponent);
  }

  ngOnInit(): void {
    // this.channelsIds = this.sharedService.getChannelsIds();
    // console.log('ChannelsIds:', this.channelsIds);
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
    });
  }

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
    console.log(this.showEmojiPicker);
  }

  /**
   * Add an emoji to the message
   */
  addEmoji(event: any) {
    const { message } = this;
    const text = `${message}${event.emoji.native}`;
    this.message = text;
  }


  addEmojiThread(event: any,) {
    let answersEmojis = this.selectedChannel.chat[this.i].reactions;
    this.existEmoji = false;
    const { message } = this;
    const text = `${message}${event.emoji.native}`;
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
    if (!this.existEmoji) {
      this.newReacktion = {
        count: 1,
        users: [],
        emoji: text,
      };
      this.selectedChannel.chat[this.i].reactions.push(this.newReacktion);
      this.selectedChannel.chat[this.i].reactions[this.j].users.push(this.UserService.getName());
    }
    this.sharedService.updateChannelFS(this.selectedChannel);
    this.showEmojiPicker[-1] = false;
    this.j = 0;
  }


  deleteEmojiThread(j: number) {
    let answersEmojis = this.selectedChannel.chat[this.i].reactions[j];
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
      this.selectedChannel.chat[this.i].reactions[j].users.push(this.UserService.getName());
      this.selectedChannel.chat[this.i].reactions[j].count++;
    }
    this.sharedService.updateChannelFS(this.selectedChannel);
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
    this.sharedService.updateChannelFS(this.selectedChannel);
  }

  toggleShowDelete(index: number) {
    this.showDelete[index] = !this.showDelete[index];
  }
  /**
   * Hide the emoji picker when the textarea is focused
   */
  onFocus() {
    // this.showEmojiPicker = false;
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
    console.log('Message channel:', this.messageThrad);
    this.selectedChannel.chat[this.i].answers.push(this.messageThrad);
    this.sharedService.updateChannelFS(this.selectedChannel);

    // this.sharedService.saveMessageToLocalStorage(
    //   this.currentChannel.id,
    //   message
    // );
    this.message = '';
  }

  getCurrentThread() {
    {
      return doc(
        collection(this.firestore, 'channels'),
        this.allgemeinChannelId[0]
      );
    }
  }

  getCleanJsonThreads(channel: any): {} {
    return {
      id: channel.id,
      chat: channel.text,
      profileImg: channel.profileImg,
      date: channel.date,
      time: channel.time,
      name: channel.name,
      owner: channel.owner,
      answers: this.message,
    };
  }

  /**
   * Closes the thread container
   */
  closeThreads(i: any) {
    if (innerWidth < 1000) {
      this.sharedService.emitRespCloseThreads(i);
      this.sharedService.emitRespOpenChannel(i);
      this.sharedService.emitOpenChannel(i);
    }
    this.sharedService.closeThreads(i);
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
}
