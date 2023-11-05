import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { UserService } from './user.service';
import { Channel } from '../models/channel';
import { userData } from '../models/userData';

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
   * Emits an event to open the principal-page component
   */
  private openNewMessageEvent = new Subject<void>();
  openNewMessageEvent$ = this.openNewMessageEvent.asObservable();

  emitOpenNewMessage() {
    this.openNewMessageEvent.next();
  }

  /**
   * Emits an event to open the new message component from Channel to Main-Chat in responsive mode
   */
  private openRespNewMessage = new ReplaySubject<any>();
  openRespNewMessage$ = this.openRespNewMessage.asObservable();

  openMainChatContainer(data: any) {
    this.openRespNewMessage.next(data);
  }

  /**
   * Emits an event to open the box to wirte component for channel und private chat
   */
  private OpenBoxToWrite = new ReplaySubject<any>();
  OpenBoxToWrite$ = this.OpenBoxToWrite.asObservable();

  emitOpenBoxToWrite(data: any) {
    this.OpenBoxToWrite.next(data);
  }

  /**
   * Emits an event to open the selected component in main-chat
   */
  private openMainChatContainerEvent = new ReplaySubject<any>();
  openMainChatContainerEvent$ = this.openMainChatContainerEvent.asObservable();

  emitOpenMainChatContainerEvent(data: any) {
    this.openMainChatContainerEvent.next(data);
  }

  /**
   * Emits an event to open the chat component for channel und private chat
   */
  private OpenChat = new ReplaySubject<any>();
  OpenChat$ = this.OpenChat.asObservable();

  emitOpenChat(data: any) {
    this.OpenChat.next(data);
  }

  /**
   * Emits an event to open the channel component
   */
  private openChannelEvent = new ReplaySubject<Channel>();
  openChannelEvent$ = this.openChannelEvent.asObservable();

  emitOpenChannel(channel: Channel) {
    this.openChannelEvent.next(channel);
  }

  /**
   * Emits an event to open the channel component in responsive mode
   */
  private openRespChannelEvent = new Subject<any>();
  openRespChannelEvent$ = this.openRespChannelEvent.asObservable();

  emitRespOpenChannel(channel: any) {
    this.openRespChannelEvent.next(channel);
  }

  /**
   * Emits an event to open the private messages component
   */
  private openPrivateContainerEvent = new ReplaySubject<userData>();
  openPrivateContainerEvent$ = this.openPrivateContainerEvent.asObservable();

  emitOpenPrivateContainer(member: any) {
    this.UserService.selectedChatPartner = member;
    this.UserService.subToChosenChat();
    this.openPrivateContainerEvent.next(member);
  }

  /**
   * Emits an event to open the private messages component in responsive mode
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
  private respCloseThreadsEvent = new Subject<Channel>();
  respCloseThreadsEvent$ = this.respCloseThreadsEvent.asObservable();

  emitRespCloseThreads(channel: Channel) {
    this.respCloseThreadsEvent.next(channel);
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
