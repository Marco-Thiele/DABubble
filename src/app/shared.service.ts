import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  private isEditChannelOpen = false;

  getIsEditChannelOpen(): boolean {
    return this.isEditChannelOpen;
  }

  setIsEditChannelOpen(value: boolean): void {
    this.isEditChannelOpen = value;
  }

  /**
   * Emits an event to open the new message component from Channel to Main-Chat
   */
  private openNewMessageEvent = new Subject<void>();

  openNewMessageEvent$ = this.openNewMessageEvent.asObservable();

  emitOpenNewMessage() {
    this.openNewMessageEvent.next();
  }

  /**
   * Emits an event to open the channel component from Main-Chat to Channel
   */
  private openChannelEvent = new Subject<void>();

  openChannelEvent$ = this.openChannelEvent.asObservable();

  emitOpenChannel() {
    this.openChannelEvent.next();
  }

  private openPrivateContainerEvent = new Subject<void>();

  openPrivateContainerEvent$ = this.openPrivateContainerEvent.asObservable();

  emitOpenPrivateContainer() {
    this.openPrivateContainerEvent.next();
  }
}
