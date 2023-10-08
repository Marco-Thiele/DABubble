import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private channels: any[] = [];
  private isEditChannelOpen = false;
  private members: any[] = [];

  constructor() {
    const storedChannels = localStorage.getItem('channels');
    if (storedChannels) {
      this.channels = JSON.parse(storedChannels);
    }
  }

  /**
   * Generates a unique id.
   * @returns a unique id
   */
  generateUniqueId(): string {
    return uuidv4();
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
  private openChannelEvent = new Subject<any>();

  openChannelEvent$ = this.openChannelEvent.asObservable();

  emitOpenChannel(channel: any) {
    this.openChannelEvent.next(channel);
  }

  /**
   * Emits an event to open the private container from Main-Chat to Private
   */
  private openPrivateContainerEvent = new Subject<any>();

  openPrivateContainerEvent$ = this.openPrivateContainerEvent.asObservable();

  emitOpenPrivateContainer(member: any) {
    this.openPrivateContainerEvent.next(member);
  }

  /**
   * Adds a channel to the list of channels.
   * @param channel the channel to add
   */
  addChannel(channel: any) {
    this.channels.push(channel);
    this.saveChannelToLocalStorage();
  }

  /**
   * Gets the list of channels.
   * @returns the list of channels
   */
  getChannels() {
    return this.channels;
  }

  /**
   * Saves the channel to local storage.
   * @param id the id of the channel
   * @returns the channel
   */
  private saveChannelToLocalStorage() {
    localStorage.setItem('channels', JSON.stringify(this.channels));
  }

  addMember(member: any) {
    this.members.push(member);
    this.saveMembersToLocalStorage();
  }

  getMembers(): any[] {
    const storedMembers = localStorage.getItem('members');
    return storedMembers ? JSON.parse(storedMembers) : [];
  }

  private saveMembersToLocalStorage() {
    localStorage.setItem('members', JSON.stringify(this.members));
  }
}
