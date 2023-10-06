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

  showIconCatalog = false;
  name = 'Angular';
  message = '';
  showEmojiPicker = false;
  isFocused = false;
  taIsFocused = false;

  constructor(
    private dialog: MatDialog,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {}

  isEditChannelOpen(): boolean {
    return this.sharedService.getIsEditChannelOpen();
  }

  /**
   * Shows the edit Channel component
   */
  editChannel() {
    this.dialog.open(ChannelEditComponent, {});
    this.sharedService.setIsEditChannelOpen(true);
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
}
