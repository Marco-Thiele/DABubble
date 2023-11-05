import { Component, OnInit, inject } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { Firestore } from '@angular/fire/firestore';
import { EmitOpenService } from 'src/app/services/emit-open.service';
@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss'],
})
export class MainChatComponent implements OnInit {
  firestore: Firestore = inject(Firestore);

  openPrincipalPage: boolean = true;
  openChannelPage: boolean = false;
  openChatPage: boolean = false;
  selectedMember: any;
  selectedChannel: any;
  data: any;

  constructor(
    private sharedService: SharedService,
    private EmitOpenService: EmitOpenService
  ) {
    this.openNewMessage();
    this.openContainerMainChat(this.data);
    this.openNewMessage();
  }

  ngOnInit(): void {}

  /**
   * Opens the main chat container
   * @param data the data to open the main chat container
   */
  openContainerMainChat(data: any) {
    this.EmitOpenService.openMainChatContainerEvent$.subscribe(
      (receivedData: any) => {
        const channel = receivedData.channel;
        const member = receivedData.member;
        const newMessage = receivedData.newMessage;

        if (channel) {
          this.openChannelPage = true;
          this.openPrincipalPage = false;
          this.openChatPage = false;
          this.selectedChannel = channel;
        } else if (member) {
          this.openPrincipalPage = false;
          this.openChannelPage = false;
          this.openChatPage = true;
          this.selectedMember = member;
        } else if (newMessage) {
          this.openPrincipalPage = true;
          this.openChannelPage = false;
          this.openChatPage = false;
        }
      }
    );
  }

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
      this.openChannelPage = true;
      this.openPrincipalPage = false;
      this.openChatPage = false;
      this.selectedChannel = channel;
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
}
