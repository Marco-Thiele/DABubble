import { Component, OnInit, inject } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { Firestore } from '@angular/fire/firestore';
import { EmitOpenService } from 'src/app/services/emit-open.service';
@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss'],
})
export class MainChatComponent implements OnInit {
  firestore: Firestore = inject(Firestore);

  //variables for new structure//
  openPrincipalPage: boolean = true;
  openChannelPage: boolean = false;
  openChatPage: boolean = false;
  selectedMember: any;
  selectedChannel: any;
  //-------------------------//

  // private chatSubscription: Subscription = new Subscription();

  constructor(
    private sharedService: SharedService,
    private EmitOpenService: EmitOpenService
  ) {
    this.openNewMessage();
    // this.loadChannel();
    this.openChannelContainer(this.selectedChannel); //dont erase this line
    this.privateChatWithMember(this.selectedMember); //dont erase this line
    this.openNewMessage();
  }

  ngOnInit(): void {}

  //Functions for new structure//
  /**
   * Opens the new message component which is used to create a new channel or to start a new chat with a member
   */
  openNewMessage() {
    this.EmitOpenService.openNewMessageEvent$.subscribe(() => {
      this.openPrincipalPage = true;
      this.openChannelPage = false;
      this.openChatPage = false;
    });
  }

  /*
   * Opens the channel container
   * @param channel the channel to open
   */
  openChannelContainer(channel: any) {
    this.EmitOpenService.openChannelEvent$.subscribe((channel: any) => {
      console.log('channel', channel);
      this.openChannelPage = true;
      this.openPrincipalPage = false;
      this.openChatPage = false;
      this.selectedChannel = channel;
      // this.scrollToBottom();
    });
  }

  /**
   * Opens the private container with a member
   * @param member the member to open
   */
  privateChatWithMember(member: any) {
    this.EmitOpenService.openPrivateContainerEvent$.subscribe((member: any) => {
      this.openPrincipalPage = false;
      this.openChannelPage = false;
      this.openChatPage = true;
      this.selectedMember = member;
    });
  }
  //-------------------------//

  // ngOnDestroy() {
  //   this.chatSubscription.unsubscribe();
  // }

  // /**
  //  * It is executed when the view is initialized
  //  */
  // ngAfterViewInit() {
  //   if (this.messageTextarea && this.messageTextarea.nativeElement) {
  //   }
  // }

  // scrollToTop() {
  //   if (this.membersContainer) {
  //     const containerElement = this.membersContainer.nativeElement;
  //     containerElement.scrollTop = 0;
  //   }
  // }

  /**
   * Loads the channel
   */
  // loadChannel() {
  //   const channels = this.sharedService.getChannelsFromFS();
  //   if (channels) {
  //     this.isNewMessageVisible = true;
  //     this.isChannelVisible = false;
  //   } else {
  //     this.selectChannel(channels);
  //   }
  // }

  // /**
  //  * Selects a channel
  //  * @param channel the channel to select
  //  */
  // selectChannel(channel: any) {
  //   this.isChannelVisible = true;
  //   this.selectedChannel = channel;
  //   this.currentChannel = channel;
  //   this.sendChannel = true;
  // }
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
