import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-new-channel-members',
  templateUrl: './new-channel-members.component.html',
  styleUrls: ['./new-channel-members.component.scss'],
  standalone: true,
  imports: [
    MatRadioModule,
    FormsModule,
    MatCheckboxModule,
    MatCardModule,
    CommonModule,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class NewChannelMembersComponent implements OnInit {
  membersAdded = false;
  checked: boolean = false;
  showCheckbox: boolean = false;
  disabled = false;
  labelPosition: string;
  indeterminate = false;
  isButtonDisabled: boolean = false;
  buttonColor: string = '#444df2';
  channel: any;
  memberName: string = '';
  memberMatches: any[] = [];
  selectedMembers: any[] = [];
  selectedMember: any = null;

  constructor(
    public dialogRef: MatDialogRef<NewChannelMembersComponent>,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.labelPosition = 'after';
    this.channel = data.channel;
  }

  ngOnInit(): void {}

  /**
   * Close the dialog
   */
  closeAddNewChannelMembers() {
    this.dialogRef.close();
  }

  searchMembers() {
    this.memberMatches = [];
    const memberName = this.memberName.trim();
    if (memberName === '') {
      return;
    }

    const members = this.sharedService.getMembers();

    // Excluir el primer miembro de la lista cargada del localStorage
    const filteredMembers = members.slice(1); // Excluye el primer miembro
    this.memberMatches = filteredMembers.filter((member) =>
      member.name.toLowerCase().includes(memberName.toLowerCase())
    );

    this.memberMatches.forEach((match) => {
      match.imgProfil = this.getImgProfil(match);
    });
  }

  getImgProfil(member: any): string {
    if (member.imgProfil && member.imgProfil !== '') {
      return member.imgProfil;
    } else {
      return 'assets/img/avatars/avatar-1.png';
    }
  }

  addMemberToChannel(member: any) {
    this.channel.members.push(member);
    this.sharedService.addChannel(this.channel);
    this.memberName = '';
    this.isButtonDisabled = true;
    this.buttonColor = '#686868';
    this.memberMatches = [];
  }

  /**
   * Add members to the channel
   */
  addNewChannelMembers() {
    if (this.labelPosition === 'after') {
      const members = this.sharedService.getMembers();
      const officeTeamMembers = members.filter((member) =>
        member.channels.includes('Office-team')
      );
      this.channel.members.push(...officeTeamMembers);
    } else {
      const selectedMembers = this.memberMatches.filter(
        (match) => match.selected
      );
      this.channel.members.push(...this.selectedMembers);
      this.memberMatches = [];
      this.selectedMembers = [];
    }
    if (this.channel.members.length > 0) {
      this.sharedService.addChannel(this.channel);
      this.dialogRef.close(true);
    }
  }

  toggleMemberSelection(member: any) {
    if (this.selectedMembers.includes(member)) {
    }

    member.selected = true;
    this.selectedMembers.push(member);

    this.isButtonDisabled = this.selectedMembers.length === 0;
    this.buttonColor = this.isButtonDisabled ? '#686868' : '#444df2';
  }

  removeSelectedMember(member: any) {
    member.selected = false;
    this.selectedMembers = this.selectedMembers.filter((m) => m !== member);

    this.isButtonDisabled = this.memberMatches.every(
      (match) => !match.selected
    );
    this.isButtonDisabled = this.selectedMembers.length === 0;
    this.buttonColor = this.isButtonDisabled ? '#686868' : '#444df2';
  }

  /**
   * Change the color of the button and enable or disable it
   * @param value
   */
  onChangeRadioButton(value: string) {
    this.labelPosition = value;

    if (value === 'before') {
      this.showCheckbox = true;
      this.isButtonDisabled = true;
      this.buttonColor = '#686868';
    } else {
      this.showCheckbox = false;
      this.isButtonDisabled = false;
      this.buttonColor = '#444df2';
    }
  }

  /**
   * Disable the button if the user finds a member
   */
  lookForMember() {
    this.isButtonDisabled = false;
    this.buttonColor = '#444df2';
  }
}
