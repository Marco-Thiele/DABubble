import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserProfilComponent } from 'src/app/main-page/profils-components/user-profil/user-profil.component';
import { DialogService } from 'src/app/services/dialog.service';
import { Subscription } from 'rxjs';
import { EmitOpenService } from 'src/app/services/emit-open.service';
import { onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-chat-contain',
  templateUrl: './chat-contain.component.html',
  styleUrls: ['./chat-contain.component.scss'],
})
export class ChatContainComponent implements OnInit {
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;

  private chatSubscription: Subscription = new Subscription();

  selectedMember: any;
  selectedChannel: any;
  currentChatData: any;
  previousDate: string = '';
  showEmojiPicker: boolean[] = [false, false];
  showEdit: boolean[] = [false, false];
  editMessageUser: boolean[] = [false, false];
  message: string = '';
  j: number = 0;
  editedMessageUser: string = '';
  currentChannel: any;
  autoScrollEnabled = true;
  data: any;

  constructor(
    private sharedService: SharedService,
    public userService: UserService,
    private dialogService: DialogService,
    private EmitOpenService: EmitOpenService
  ) {
    // this.privateChatWithMember(this.selectedMember);
    // this.openChannelContainer(this.selectedChannel);
    this.OpenChat(this.data);
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.chatSubscription.unsubscribe();
  }

  /**
   * Opens the channel container
   * @param channel the channel to open
   */
  OpenChat(data: any) {
    this.EmitOpenService.OpenChat$.subscribe((receivedData: any) => {
      const channel = receivedData.channel;
      const member = receivedData.member;
      console.log('receivedData', receivedData);

      if (channel) {
        this.selectedChannel = [];
        this.getMessages(channel);
        this.currentChannel = channel;
        this.currentChatData = false;
        this.selectedMember = '';
      } else if (member) {
        console.log('member', member);
        this.selectedChannel = null;
        console.log('this.selectedChannel', this.selectedChannel);
        this.currentChannel = null;
        console.log('this.currentChannel', this.currentChannel);
        this.currentChatData = true;
        console.log('this.currentChatData', this.currentChatData);
        this.selectedMember = member;
        console.log('this.selectedMember', this.selectedMember);
        this.getsPrivateChats();
        console.log('this.getsPrivateChats', this.getsPrivateChats);
      }
    });
  }

  getMessagesToDisplay(): any[] {
    if (this.selectedMember && this.currentChatData) {
      return this.currentChatData.chat || [];
    } else if (this.selectedChannel) {
      return this.selectedChannel.chat || [];
    }
    return [];
  }

  /*
   * Opens the channel container
   * @param channel the channel to open
   */
  // openChannelContainer(channel: any) {
  //   this.EmitOpenService.openChannelEvent$.subscribe((channel: any) => {
  //     this.selectedChannel = channel;
  //     this.getMessages(channel);
  //     this.currentChannel = channel;
  //   });
  // }

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

  // privateChatWithMember(member: any) {
  //   this.EmitOpenService.openPrivateContainerEvent$.subscribe((member: any) => {
  //     this.selectedChannel = null;
  //     this.currentChannel = null;
  //     this.currentChatData = true;
  //     this.selectedMember = member;
  //     this.getsPrivateChats();
  //   });
  // }

  getsPrivateChats() {
    this.chatSubscription = this.userService
      .subToChosenChat()
      .subscribe((chatData) => {
        this.currentChatData = chatData;
      });
  }

  /**
   * Scrolls to the bottom of the chat
   */
  scrollToBottom() {
    if (this.selectedMember || this.selectedChannel) {
      const chatElement = this.chatContainer.nativeElement;
      chatElement.scrollTop = chatElement.scrollHeight;
    }
  }

  parseDate(dateString: string): string {
    if (dateString.includes('.')) {
      const [day, month, year] = dateString.split('.').map(Number);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return `${year}-${month}-${day}`;
      }
    }
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/').map(Number);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return `${year}-${month}-${day}`;
      }
    }
    return '';
  }

  updatePreviousDate(date: string) {
    this.previousDate = date;
  }

  /**
   * Show the emoji picker
   */
  toggleEmojiPicker(index: number) {
    this.showEmojiPicker[index] = !this.showEmojiPicker[index];
  }

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

  /**
   * Opens the threads container
   * @param member the member to open
   */
  openThread(i: number, messageID: any) {
    if (this.selectedChannel) {
      if (window.innerWidth < 1000) {
        this.EmitOpenService.emitRespOpenThreadsEvent();
      }
      this.sharedService.selectedChannel = this.selectedChannel;
      this.sharedService.i = i;
      this.sharedService.messageID = messageID;
      this.sharedService.loadThreads();
      this.EmitOpenService.openThread = true;
      this.EmitOpenService.openThreads();
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

  getLastAnswerTime(message: any): string | null {
    const answers = message.answers;
    if (answers.length > 0) {
      const latestAnswer = answers.reduce((latest: any, current: any) => {
        const latestTime = new Date(latest.time);
        const currentTime = new Date(current.time);
        return latestTime > currentTime ? latest : current;
      });

      return latestAnswer.time;
    } else {
      return null;
    }
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
