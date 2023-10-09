import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root',
})
export class SharedService implements OnInit {
  private channels: any[] = [];
  private isEditChannelOpen = false;
  private members: any[] = [];

  constructor(private auth: Auth) {
    const storedChannels = localStorage.getItem('channels');
    if (storedChannels) {
      this.channels = JSON.parse(storedChannels);
    }
  }

  ngOnInit(): void {}

  getID(): string {
    const uid = this.auth.currentUser?.uid ?? '';
    return uid;
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

  updateChannel(updatedChannel: any) {
    const index = this.channels.findIndex(
      (channel) => channel.id === updatedChannel.id
    );
    if (index !== -1) {
      this.channels[index] = updatedChannel;
      this.saveChannelsToLocalStorage();
    }
  }

  private saveChannelsToLocalStorage() {
    localStorage.setItem('channels', JSON.stringify(this.channels));
  }

  /**
   * Saves the channel to local storage.
   * @param id the id of the channel
   * @returns the channel
   */
  private saveChannelToLocalStorage() {
    localStorage.setItem('channels', JSON.stringify(this.channels));
  }

  /**
   * Adds a member to the list of members.
   * @param member the member to add
   */
  addMember(member: any) {
    this.members.push(member);
    this.saveMembersToLocalStorage();
  }

  /**
   * Gets the list of members.
   * @returns the list of members
   */
  getMembers(): any[] {
    const storedMembers = localStorage.getItem('members');
    return storedMembers ? JSON.parse(storedMembers) : [];
  }

  /**
   * Saves the member to local storage.
   * @param id the id of the member
   * @returns the member
   */
  private saveMembersToLocalStorage() {
    localStorage.setItem('members', JSON.stringify(this.members));
  }

  updateMember(updatedMember: any) {
    const index = this.members.findIndex(
      (member) => member.id === updatedMember.id
    );
    if (index !== -1) {
      this.members[index] = updatedMember;
      this.saveMembersToLocalStorage();
      console.log('Member updated:', updatedMember);
    }
  }
}
