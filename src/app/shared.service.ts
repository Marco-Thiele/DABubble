import { Injectable, OnInit, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class SharedService implements OnInit {
  private channels: any[] = [];
  private isEditChannelOpen = false;
  private members: any[] = [];
  private membersData = new BehaviorSubject<any[]>([]);

  currentMembers = this.membersData.asObservable();
  firestore: Firestore = inject(Firestore);
  channelsListArray: any[] = [];
  privatesListArray: any[] = [];
  membersListArray: any[] = [];

  unsubChannels;
  unsubMembers;

  constructor(private auth: Auth) {
    const storedChannels = localStorage.getItem('channels');
    if (storedChannels) {
      this.channels = JSON.parse(storedChannels);
    }

    this.unsubChannels = this.channelsList();
    this.unsubMembers = this.getMembersList();
  }

  ngOnInit(): void {}

  //Delete a channel from firestore
  async deleteChannelFS(colId: string, docId: any) {
    await deleteDoc(this.getsingleDocRef(colId, docId))
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        console.log('Document deleted');
      });
  }

  //Updates the channel in firestore
  async updateChannelFS(channel: any) {
    if (channel.id) {
      let docRef = this.getsingleDocRef(
        this.getColIdFromChannel(channel),
        channel.id
      );
      await updateDoc(docRef, this.getCleanJson(channel))
        .catch((err) => {
          console.log(err);
        })
        .then(() => {
          console.log('Document updated');
        });
    }
  }

  //updates the array of channels in firestore
  getCleanJson(channel: any): {} {
    return {
      id: channel.id,
      chat: channel.chat,
      description: channel.description,
      members: channel.members,
      name: channel.name,
      owner: channel.owner,
    };
  }

  //return the channels from firestore
  getColIdFromChannel(channel: any) {
    if (channel.name || channel.description || channel.members) {
      return 'channels';
    } else {
      return '';
    }
  }

  //updates the chat member in Firestore
  async updatePrivateChatFS(members: any) {
    if (members.id) {
      let docRef = this.getsingleDocRef(
        this.getColIdFromMember(members),
        members.id
      );

      await updateDoc(docRef, this.getCleanJsonMember(members))
        .catch((err) => {
          console.log(err);
        })
        .then(() => {
          console.log('Document updated');
        });
    }
  }

  //updates the array of member from firestore
  getCleanJsonMember(members: any): {} {
    return {
      id: members.id,
      chat: members.chat,
      member: members.member,
    };
  }

  //return the members from firestore
  getColIdFromMember(members: any) {
    if (members.chat) {
      return 'members';
    } else {
      return '';
    }
  }

  //It adds a channel to firestore
  async addChannelFS(channel: any) {
    await addDoc(this.getChannelsFromFS(), channel)
      .catch((err) => {
        console.log(err);
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef?.id);
      });
  }

  //It adds a member to firestore
  async addMemberFS(member: any) {
    await addDoc(this.getMembersFromFS(), member)
      .catch((err) => {
        console.log(err);
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef?.id);
      });
  }

  ngonDestroy(): void {
    this.unsubChannels();
    this.unsubMembers();
  }

  //gets the channels from firestore
  channelsList() {
    return onSnapshot(this.getChannelsFromFS(), (list) => {
      this.channelsListArray = [];
      list.forEach((element) => {
        this.channelsListArray.push(
          this.setChannelObject(element.data(), element.id)
        );
      });
    });
  }

  //gets the members from firestore
  getMembersList() {
    return onSnapshot(this.getMembersFromFS(), (list) => {
      this.membersListArray = [];
      list.forEach((element) => {
        this.membersListArray.push(
          this.setChannelObject(element.data(), element.id)
        );
      });
    });
  }

  //return the members from firestore
  getMembersFromFS() {
    return collection(this.firestore, 'members');
  }

  //return the channels from firestore
  getChannelsFromFS() {
    return collection(this.firestore, 'channels');
  }

  //sets the channel object from firestore
  setChannelObject(obj: any, id: string) {
    return {
      id: id,
      chat: obj.chat || [],
      description: obj.description || '',
      members: obj.members || [],
      name: obj.name || '',
      owner: obj.owner || '',
    };
  }

  //gets the single document reference from firestore
  getsingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  /**
   * updates the members in channel
   * @param members  the members to update
   */
  updateMembers(members: any[]) {
    this.membersData.next(members);
    this.saveChannelToLocalStorage();
  }

  /**
   * Gets the id of the current user.
   * @returns the id of the current user
   */
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

  getChannelsFromLS(): any[] {
    const storedChannels = localStorage.getItem('channels');
    return storedChannels ? JSON.parse(storedChannels) : [];
  }

  /**
   * Gets the channel by id.
   * @param id the id of the channel
   * @returns the channel
   */
  updateChannel(updatedChannel: any) {
    const index = this.channels.findIndex(
      (channel) => channel.id === updatedChannel.id
    );
    if (index !== -1) {
      this.channels[index] = updatedChannel;
      this.saveChannelToLocalStorage();
    }
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
  saveMembersToLocalStorage() {
    localStorage.setItem('members', JSON.stringify(this.members));
  }

  /**
   * updates the member to local storage.
   * @param id the id of the member
   * @returns the member
   */
  updateMember(updatedMember: any) {
    const index = this.members.findIndex(
      (member) => member.id === updatedMember.id
    );
    if (index !== -1) {
      this.members[index] = updatedMember;
      this.saveMembersToLocalStorage();
    }
  }

  /**
   * saves the message of channels to local storage.
   * @returns the list of private messages
   */
  saveMessageToLocalStorage(channelId: string, message: any) {
    const storedChannels = localStorage.getItem('channels');
    const channels = storedChannels ? JSON.parse(storedChannels) : [];

    const channel = channels.find((c: any) => c.id === channelId);

    if (channel) {
      channel.chat.push(message);
    }

    localStorage.setItem('channels', JSON.stringify(channels));
  }

  /**
   * saves the message of private messages to local storage.
   * @returns the list of private messages
   */
  savePrivateMessageToLocalStorage(memberId: string, message: any) {
    const storedPrivateMsg = localStorage.getItem('privateMessages');
    let privateMessages = storedPrivateMsg ? JSON.parse(storedPrivateMsg) : {};

    if (!privateMessages[memberId]) {
      privateMessages[memberId] = {
        id: memberId,
        chat: [],
      };
    }

    privateMessages[memberId].chat.push(message);
    localStorage.setItem('privateMessages', JSON.stringify(privateMessages));
  }

  /**
   * gets the message of channels from local storage.
   * @returns the list of channels messages
   */
  getChannelsIds(): {
    [channelId: string]: { chat: any[] };
  } {
    const channelMessages: {
      [channelId: string]: { chat: any[] };
    } = {};

    const storedChannels = localStorage.getItem('channels');
    const channels = storedChannels ? JSON.parse(storedChannels) : [];
    channels.forEach((channel: any) => {
      const channelId = channel.id;
      channelMessages[channelId] = {
        chat: this.getMessagesForChannel(channelId),
      };
    });

    return channelMessages;
  }

  /**
   * return the message for the channels
   * @returns the list of private messages
   */
  getMessagesForChannel(channelId: string): any[] {
    const storedChannels = localStorage.getItem('channels');
    const channels = storedChannels ? JSON.parse(storedChannels) : [];

    const channel = channels.find((c: any) => c.id === channelId);

    return channel ? channel.chat : [];
  }

  /**
   * return the message for the private messages
   * @returns the list of private messages
   */
  returnPrivateChats(memberId: string) {
    const storedPrivateMsg = localStorage.getItem('privateMessages');
    if (storedPrivateMsg) {
      const privateMessages = JSON.parse(storedPrivateMsg);
      if (privateMessages[memberId]) {
        return privateMessages[memberId] || [];
      }
    }
    return { chat: [] };
  }
}
