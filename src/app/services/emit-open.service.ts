import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class EmitOpenService {
  openThread: boolean = true;

  private isEditChannelOpen = false;
  private openThreadCont: () => void;
  private closeThreadCont: (i: any) => void;

  constructor(private UserService: UserService) {
    this.openThreadCont = () => {};
    this.closeThreadCont = () => {};
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
   * Emits an event to open the new message component from Channel to Main-Chat in responsive mode
   */
  private openRespNewMessage = new Subject<void>();

  openRespNewMessage$ = this.openRespNewMessage.asObservable();

  openMainChatContainer() {
    this.openRespNewMessage.next();
  }

  /**
   * Emits an event to open the channel component from Main-Chat to Channel
   */
  private openChannelEvent = new Subject<any>();

  openChannelEvent$ = this.openChannelEvent.asObservable();

  emitOpenChannel(channel: any) {
    this.openChannelEvent.next(channel);
  }

  /**
   * Emits an event to open the channel component from Main-Chat to Channel in responsive mode
   */
  private openRespChannelEvent = new Subject<any>();

  openRespChannelEvent$ = this.openRespChannelEvent.asObservable();

  emitRespOpenChannel(channel: any) {
    this.openRespChannelEvent.next(channel);
  }

  /**
   * Emits an event to open the private container from Main-Chat to Private
   */
  private openPrivateContainerEvent = new Subject<any>();

  openPrivateContainerEvent$ = this.openPrivateContainerEvent.asObservable();

  emitOpenPrivateContainer(member: any) {
    this.openPrivateContainerEvent.next(member);
    this.UserService.selectedChatPartner = member;

    this.UserService.subToChosenChat();
  }

  /**
   * Emits an event to open the private container from Main-Chat to Private in responsive mode
   */
  private respOpenPrivateContainerEvent = new Subject<any>();

  respOpenPrivateContainerEvent$ =
    this.respOpenPrivateContainerEvent.asObservable();

  emitRespOpenPrivateContainer(member: any) {
    this.respOpenPrivateContainerEvent.next(member);
  }

  /**
   * Emits an event to open the threads container in responsive mode.
   */
  private respOpenThreadsEvent = new Subject<any>();

  respOpenThreadsEvent$ = this.respOpenThreadsEvent.asObservable();

  emitRespOpenThreadsEvent() {
    this.respOpenThreadsEvent.next('');
  }

  /**
   * Emits an event to close the threads container in responsive mode.
   */
  private respCloseThreadsEvent = new Subject<any>();

  respCloseThreadsEvent$ = this.respCloseThreadsEvent.asObservable();

  emitRespCloseThreads(i: any) {
    this.respCloseThreadsEvent.next(i);
  }

  /**
   * Emits an event to change the icon in responsive mode.
   */
  private iconResponsiveSubject = new Subject<boolean>();

  iconResponsive$ = this.iconResponsiveSubject.asObservable();

  toggleIconResponsive(value: boolean) {
    this.iconResponsiveSubject.next(value);
  }

  /**
   * Emits an event to open the channels container in responsive mode.
   */
  private onResizeRequestedSubject = new Subject<void>();

  onResizeRequestedSubject$ = this.onResizeRequestedSubject.asObservable();

  callOnResize() {
    this.onResizeRequestedSubject.next();
  }

  /**
   * Registers the callback function to open the thread container.
   * @param callback the callback function to register
   */
  registeropenThreadCont(callback: () => void) {
    this.openThreadCont = callback;
  }

  /**
   * Opens the thread container.
   */
  openThreads() {
    if (this.openThreadCont) {
      this.openThreadCont();
    }
  }

  /**
   * Registers the callback function to close the thread container.
   * @param callback the callback function to register
   */
  registercloseThreads(callback: () => void) {
    this.closeThreadCont = callback;
  }

  /**
   * Closes the thread container.
   */
  closeThreads(i: any) {
    if (this.closeThreadCont) {
      this.closeThreadCont(i);
    }
  }

  /**
   * Gets the value of the edit channel component.
   * @returns true if the edit channel component is open, false otherwise
   */
  getIsEditChannelOpen(): boolean {
    return this.isEditChannelOpen;
  }

  /**
   * Sets the value of the edit channel component.
   * @param value the value to set
   */
  setIsEditChannelOpen(value: boolean): void {
    this.isEditChannelOpen = value;
  }
}
