import {
  Component,
  OnInit,
  ViewEncapsulation,
  Renderer2,
  Inject,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-add-channel-members',
  templateUrl: './add-channel-members.component.html',
  styleUrls: ['./add-channel-members.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddChannelMembersComponent implements OnInit {
  userFound = false;
  isDialogOpen = false;
  memberMatches: any[] = [];
  memberName: string = '';
  isButtonDisabled: boolean = true;
  selectedMembers: any[] = [];
  buttonColor: string = '#686868';
  members: any[] = [];
  channel: any = {};

  constructor(
    public dialogRef: MatDialogRef<AddChannelMembersComponent>,
    private renderer: Renderer2,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.members = data.members;
    this.channel = data.selectedChannel;
  }

  ngOnInit(): void {
    this.isDialogOpen = true;
    this.renderer.addClass(document.body, 'dialog-open');
  }

  /**
   * The function is used to close the dialog
   */
  closeAddMembers() {
    this.dialogRef.close();
  }

  /**
   * The function is used to look for the user
   */
  lookForUser() {
    this.userFound = true;
  }
  /**
   * Add members to the channel
   */
  addMember() {
    const selectedMembers = this.memberMatches.filter(
      (match) => match.selected
    );
    this.channel.members.push(...this.selectedMembers);
    if (this.selectedMembers.length > 0) {
      // this.sharedService.updateMembers(this.channel.members);
      this.sharedService.updateChannelFS(this.channel);
      this.dialogRef.close();
    }
  }

  /**
   * The function is called when the user types in the input field to look for a member
   * @param event the event that is triggered when the user types in the input field
   */
  searchInLocalStorage(event: Event) {
    const searchText = (event.target as HTMLInputElement).value;
    if (searchText) {
      const searchTerm = searchText;
      this.searchInMembers(searchTerm);
    }
  }

  /**
   * The function is called when the user types in the input field to look for a member in server
   * @param searchTerm the term to search for
   * @returns the matches
   */
  searchInMembers(searchTerm: string): string[] {
    this.memberMatches = [];
    this.memberName = searchTerm.trim();
    if (this.memberName === '') {
      return [];
    }

    const members = this.sharedService.getMembers();
    const filteredMembers = members.slice(1);
    this.memberMatches = filteredMembers.filter((member) =>
      member.name.toLowerCase().includes(this.memberName.toLowerCase())
    );

    this.memberMatches.forEach((match) => {});

    return this.memberMatches.map((match) => match.name);
  }

  /**
   * Toggle the selection of a member when the user looks for a member
   * @param member the member to toggle the selection
   */
  toggleMemberSelection(member: any) {
    if (this.selectedMembers.includes(member)) {
    } else {
      member.selected = true;
      this.selectedMembers.push(member);
      this.isButtonDisabled = this.selectedMembers.length === 0;
      this.buttonColor = this.isButtonDisabled ? '#686868' : '#444df2';
      this.isButtonDisabled = true;
      this.memberName = '';
      this.userFound = false;
    }
  }

  /**
   * the function removes a member from the selected members
   * @param member the member to remove
   */
  removeSelectedMember(member: any) {
    member.selected = false;
    this.selectedMembers = this.selectedMembers.filter((m) => m !== member);
    this.isButtonDisabled = this.memberMatches.every(
      (match) => !match.selected
    );
    if (this.selectedMembers.length === 0) {
      this.isButtonDisabled = true;
      this.buttonColor = '#686868';
    }
  }
}
