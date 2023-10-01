import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-channel-erstellen',
  templateUrl: './channel-erstellen.component.html',
  styleUrls: ['./channel-erstellen.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChannelErstellenComponent implements OnInit {
  isInputNameFocused = false;
  isInputDescriptionFocused = false;

  constructor(public dialogRef: MatDialogRef<ChannelErstellenComponent>) {}

  ngOnInit(): void {}

  /**
   * Closes the dialog for creating a channel.
   */
  closeCreateChannel() {
    this.dialogRef.close();
  }

  /**
   * Sets the height on the input field for the channel description.
   */
  onTextareaInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = '25px';
    target.style.height = target.scrollHeight + 'px';
  }

  /**
   * Creates a channel.
   */
  createChannel() {
    this.dialogRef.close();
  }
}
