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
  showIconCatalog = false;
  name = 'Angular';
  message = '';
  messageThrad: {} = {};
  threads = {
    id: '',
    userName: '',
    profileImg: '',
    imageUrl: '',
    text: '',
    time: '',
    reactions: '',
    answers: [],
    date: '',
  };
  threadAnswersJson: [] = [];
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

  showUserProfil(userName: string, userPhotoURL: string) {
    this.UserService.selectedUserName = userName;
    this.UserService.selectedUserPhotoURL = userPhotoURL;
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

    this.memberMatches.forEach((match) => {
      console.log('Match:', match);
    });

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

    // const channels = this.sharedService.getChannelsFromLS();
    // this.channelMatches = channels.filter((channel) =>
    //   channel.name.toLowerCase().includes(channelName.toLowerCase())
    // );

    this.channelMatches.forEach((match) => {
      console.log('Match:', match);
    });

    return this.channelMatches.map((match) => match.name);
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
  closeThreads() {
    this.sharedService.closeThreads();
  }
}
