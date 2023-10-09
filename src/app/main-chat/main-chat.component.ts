import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChannelEditComponent } from '../channel-edit/channel-edit.component';
import { SharedService } from '../shared.service';
import { ChannelMembersComponent } from '../channel-members/channel-members.component';
import { AddChannelMembersComponent } from '../add-channel-members/add-channel-members.component';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss'],
})
export class MainChatComponent implements OnInit {
  @ViewChild('imagePreviewCont') imagePreviewCont: ElementRef | undefined;
  @ViewChild('imagePreview') imagePreview: ElementRef | undefined;
  @ViewChild('chatContainer') chatContainer: ElementRef | undefined;

  showIconCatalog = false;
  name = 'Angular';
  message = '';
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

  constructor(private dialog: MatDialog, private sharedService: SharedService) {
    this.openNewMessage();
    this.openChannelContainer(this.selectedChannel);
    this.openPrivateContainerMessage(this.selectedMember);
    this.loadChannel();
  }

  ngOnInit(): void {}

  /**
   * Opens the new message component which is used to create a new channel or to start a new chat with a member
   */
  openNewMessage() {
    this.sharedService.openNewMessageEvent$.subscribe(() => {
      this.isNewMessageVisible = true;
      this.isChannelVisible = false;
      this.isPrivatChatContainerVisible = false;
      this.isPrivatChatContainerVisible = false;
      this.isPrivateChatVisible = false;
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
      this.isNewMessageVisible = false;
      this.isPrivatChatContainerVisible = false;
      this.isPrivateChatVisible = false;
      this.selectedChannel = channel;
    });
  }

  /**
   * Opens the private container with a member
   * @param member the member to open
   */
  openPrivateContainerMessage(member: any) {
    this.sharedService.openPrivateContainerEvent$.subscribe((member: any) => {
      if (member && member.type === 'user') {
        this.isPrivatChatContainerVisible = true;
        this.isPrivateChatVisible = true;
        this.isChatWithMemberVisible = false;
        this.isChannelVisible = false;
        this.isNewMessageVisible = false;
        this.selectedMember = member;
      } else {
        this.isPrivatChatContainerVisible = true;
        this.isChatWithMemberVisible = true;
        this.isPrivateChatVisible = false;
        this.isChannelVisible = false;
        this.isNewMessageVisible = false;
        this.selectedMember = member;
      }
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
  }

  /**
   * Shows the edit Channel component
   */
  editChannel(selectedChannel: any) {
    this.dialog.open(ChannelEditComponent, {
      data: { selectedChannel },
    });
    this.sharedService.setIsEditChannelOpen(true);
    console.log(selectedChannel);
  }

  /**
   * Shows the members component
   */
  showMembers() {
    this.dialog.open(ChannelMembersComponent, {});
  }

  /**
   * Shows the add members component
   */
  addMembers() {
    this.dialog.open(AddChannelMembersComponent, {});
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
}
