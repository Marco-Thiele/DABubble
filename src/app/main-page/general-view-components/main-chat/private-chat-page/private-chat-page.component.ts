import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-private-chat-page',
  templateUrl: './private-chat-page.component.html',
  styleUrls: ['./private-chat-page.component.scss'],
})
export class PrivateChatPageComponent implements OnInit {
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;

  selectedMember: any;
  autoScrollEnabled = true;
  currentChatData: any;

  private chatSubscription: Subscription = new Subscription();

  constructor(
    private sharedService: SharedService,
    public userService: UserService
  ) {
    this.privateChatWithMember(this.selectedMember);
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

  privateChatWithMember(member: any) {
    this.sharedService.openPrivateContainerEvent$.subscribe((member: any) => {
      // this.isPrivatChatContainerVisible = true;
      // this.isChatWithMemberVisible = true;
      // this.currentChatData = true;
      // this.isPrivateChatVisible = false;
      // this.isChannelVisible = false;
      // this.isNewMessageVisible = false;
      this.selectedMember = member;
      // this.selectedChannel = null;
      // this.sendPrivate = true;
      // this.sendChannel = false;
      // this.placeholderMessageBox = 'Nachricht an ' + member.name;
      // this.getsPrivateChats();
      this.scrollToBottom();
    });
  }

  // getsPrivateChats() {
  //   this.chatSubscription = this.userService
  //     .subToChosenChat()
  //     .subscribe((chatData) => {
  //       this.currentChatData = chatData;
  //     });
  // }

  // /**
  //  * Scrolls to the bottom of the chat
  //  */
  scrollToBottom() {
    if (
      // (this.isChatWithMemberVisible &&
      //   this.currentChatData &&
      this.selectedMember
      //   ) ||
      // (this.isChannelVisible && this.selectedChannel) ||
      // (this.isPrivateChatVisible && this.selectedMember && this.currentChatData)
    ) {
      const chatElement = this.chatContainer.nativeElement;
      chatElement.scrollTop = chatElement.scrollHeight;
    }
  }
}
