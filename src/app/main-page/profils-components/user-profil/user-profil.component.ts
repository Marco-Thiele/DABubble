import { Component } from '@angular/core';
import { DialogService } from '../../../services/dialog.service';
import { UserService } from '../../../services/user.service';
import { SharedService } from '../../../services/shared.service';
import { EmitOpenService } from 'src/app/services/emit-open.service';

interface member {
  email: string;
  name: string;
  profileImg: string;
  uid: string;
}
@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.scss'],
})
export class UserProfilComponent {
  profilName: string;
  profilImg: any;
  profilEmail: string;
  userID: string;

  constructor(
    private dialogService: DialogService,
    public UserService: UserService,
    public SharedService: SharedService,
    private EmitOpenService: EmitOpenService
  ) {
    this.profilName = this.UserService.selectedUserName;
    this.profilImg = this.UserService.selectedUserPhotoURL;
    this.profilEmail = this.UserService.selectedUserEmail;
    this.userID = this.UserService.selectedUserUid;
  }

  sendPrivateMessage() {
    let member = {
      email: this.profilEmail,
      name: this.profilName,
      profileImg: this.profilImg,
      uid: this.userID,
    };

    this.UserService.selectedChatPartner = member;

    this.UserService.doesChatExist();
    this.UserService.createChat();
    this.UserService.chatAlreadyExists = false;
    this.openChat(member);
    this.closeDialog();
  }

  /**
   * close this component
   *
   */
  closeDialog() {
    this.dialogService.closeDialog();
  }

  openChat(member: member) {
    if (window.innerWidth < 1000) {
      this.EmitOpenService.emitRespOpenPrivateContainer(member);
      this.EmitOpenService.toggleIconResponsive(true);
    }
    this.EmitOpenService.emitOpenMainChatContainerEvent({ member });
    this.EmitOpenService.emitOpenPrivateContainer(member);
    this.EmitOpenService.emitOpenBoxToWrite({ member });
    this.EmitOpenService.emitOpenChat({ member });
  }
}
