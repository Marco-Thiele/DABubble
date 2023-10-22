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
  query,
  where,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
  getDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class SharedService implements OnInit {
  private channels: any[] = [];
  private isEditChannelOpen = false;
  public members: any[] = [];
  private membersData = new BehaviorSubject<any[]>([]);
  private channelsData = new BehaviorSubject<any[]>([]);
  private userData: any;

  currentMembers = this.membersData.asObservable();
  firestore: Firestore = inject(Firestore);
  channelsListArray: any[] = [];
  privatesListArray: any[] = [];
  membersListArray: any[] = [];
  i: number = 0;

  unsubChannels;
  unsubMembers;

  constructor(private auth: Auth) {
    this.unsubChannels = this.channelsList();
    this.unsubMembers = this.getMembersList();
  }

  ngOnInit(): void {}

  ngonDestroy(): void {
    this.unsubChannels();
    this.unsubMembers();
  }

  /**
   * Deletes a channel from Firestore.
   * @param colId the id of the collection
   * @param docId the id of the document
   */
  async deleteChannelFS(colId: string, docId: any) {
    await deleteDoc(this.getsingleDocRef(colId, docId));
  }

  /**
   * updates the channel in Firestore.
   * @param channel the channel to update
   */
  async updateChannelFS(channel: any) {
    if (channel.id) {
      let docRef = this.getsingleDocRef(
        this.getColIdFromChannel(channel),
        channel.id
      );
      await updateDoc(docRef, this.getCleanJson(channel));
    }
  }

  /**
   * takes the list of private messages in Firestore.
   * @param member the member to update
   */
  async privateMsgList(selectedMember: any) {
    const querySnapshot = await getDocs(
      query(
        collection(this.firestore, 'members'),
        where('id', '==', selectedMember.id)
      )
    );

    if (querySnapshot.empty) {
      return;
    }

    const selectedMemberDoc: QueryDocumentSnapshot<DocumentData> =
      querySnapshot.docs[0];
    const memberData = selectedMemberDoc.data();
    selectedMember.chat = memberData['chat'];

    if (selectedMember.chat && selectedMember.chat.length > 0) {
    }
  }

  /**
   * takes the channel chat list in Firestore.
   * @param member the member to update
   */
  async ChannelChatList(channelId: string) {
    const querySnapshot = await getDocs(
      query(
        collection(this.firestore, 'channels'),
        where('id', '==', channelId)
      )
    );

    if (querySnapshot.empty) {
      return;
    }

    const channelDoc: QueryDocumentSnapshot<DocumentData> =
      querySnapshot.docs[0];
    const channelData = channelDoc.data();

    const channelChat = channelData['chat'];

    if (channelChat && channelChat.length > 0) {
    }
  }

  /**
   * gets a clean json from channel
   * @param channel the channel to update
   * @returns the clean json
   */
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

  /**
   * gets the id of the collection
   * @param channel the channel to update
   * @returns the id of the collection
   */
  getColIdFromChannel(channel: any) {
    if (channel.name || channel.description || channel.members) {
      return 'channels';
    } else {
      return '';
    }
  }

  /**
   * Updates the private chat in Firestore.
   * @param members the members to update
   */
  async updatePrivateChatFS(members: any) {
    if (members.id) {
      let docRef = this.getsingleDocRef(
        this.getColIdFromMember(members),
        members.id
      );
      console.log(members);
      await updateDoc(docRef, this.getCleanJsonMember(members));
    }
  }

  /**
   * gets a clean json from members
   * @param members the members to update
   * @returns the clean json
   */
  getCleanJsonMember(members: any): {} {
    return {
      id: members.id,
      chat: members.chat,
      member: members.member,
      name: members.name,
      type: members.type,
      channels: members.channels,
      imgProfil: members.imgProfil,
    };
  }

  /**
   * gets the id of the member collection
   * @param members the members to update
   * @returns the member collection
   */
  getColIdFromMember(members: any) {
    if (members.chat) {
      return 'members';
    } else {
      return '';
    }
  }

  /**
   * Adds a channel to Firestore.
   * @param channel the channel to update
   */
  async addChannelFS(channel: any) {
    await addDoc(this.getChannelsFromFS(), channel);
  }

  /**
   * Adds a member to Firestore.
   * @param member the member to update
   */
  async addMemberFS(member: any) {
    await addDoc(this.getMembersFromFS(), member);
  }

  /**
   * Gets the list of channels.
   * @returns the list of channels
   */
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

  /**
   * Gets the list of members.
   * @returns the list of members
   */
  getMembersList() {
    return onSnapshot(this.getMembersFromFS(), (list) => {
      this.membersListArray = [];
      list.forEach((element) => {
        this.membersListArray.push(
          this.setMemberObject(element.data(), element.id)
        );
      });
    });
  }

  /**
   * gets the list of members from firestore
   * @returns the list of members
   */
  getMembersFromFS() {
    return collection(this.firestore, 'members');
  }

  /**
   * gets the list of members from firestore
   * @returns the list of members
   */
  async getMembersFS() {
    const querySnapshot = await getDocs(collection(this.firestore, 'members'));
    this.members = querySnapshot.docs.map((doc) =>
      this.setMemberObject(doc.data(), doc.id)
    );
    this.membersData.next(this.members);
    return this.members;
  }

  /**
   * gets the list of channels from firestore
   * @returns the list of channels
   */
  async getChannelsFS() {
    const querySnapshot = await getDocs(collection(this.firestore, 'channels'));
    this.channels = querySnapshot.docs.map((doc) =>
      this.setChannelObject(doc.data(), doc.id)
    );
    this.channelsData.next(this.channels);
    return this.channels;
  }

  /**
   * gets the list of channels from firestore
   * @returns the list of channels
   */
  getChannelsFromFS() {
    return collection(this.firestore, 'channels');
  }

  /**
   * sets the channel object from firestore
   */
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

  /**
   * Sets the member object from firestore
   * @param obj the object to set
   * @param id the id of the object
   * @returns
   */
  setMemberObject(obj: any, id: string) {
    return {
      id: id,
      chat: obj.chat || [],
      imgProfil: obj.imgProfil || '',
      member: obj.member || [],
      name: obj.name || '',
      type: obj.type || '',
      channels: obj.channels || [],
    };
  }

  /**
   * Gets the document reference from firestore
   * @param colId the id of the collection
   * @param docId the id of the document
   * @returns
   */
  getsingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  /**
   * Gets the information of the user.
   * @returns the information of the user
   */
  getUserData() {
    return this.userData;
  }

  /**
   * the user data to set
   * @param userData the user data to set
   */
  setUserData(userData: any) {
    this.userData = userData;
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
    console.log(channel);
    console.log('4');
  }

  /**
   * Emits an event to open the channel component from Main-Chat to Channel
   */
  private openRespChannelEvent = new Subject<any>();

  openRespChannelEvent$ = this.openRespChannelEvent.asObservable();

  emitRespOpenChannel(channel: any) {
    console.log('2');
    this.openRespChannelEvent.next(channel);
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
   * Gets the list of members.
   * @returns the list of members
   */
  getMembers(): any[] {
    const storedMembers = localStorage.getItem('members');
    return storedMembers ? JSON.parse(storedMembers) : [];
  }

  /**
   * Add all the members to allgemein channels.
   * @param members the list of members
   */
  async addUserToAllgemeinChannel(userToAdd: any) {
    const allgemeinChannelId = '2gLa7RRaqoFZOCpnEk8L';

    try {
      const channelRef = this.getsingleDocRef('channels', allgemeinChannelId);
      const channelSnapshot = await getDoc(channelRef);

      if (channelSnapshot.exists()) {
        const channelData = channelSnapshot.data();
        const members: any[] = channelData['members'] || [];
        const userExists = members.some(
          (member: any) => member.id === userToAdd.id
        );

        if (!userExists) {
          members.push(userToAdd);
          await updateDoc(channelRef, { members });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
