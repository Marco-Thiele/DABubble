import { Component } from '@angular/core';

@Component({
  selector: 'app-pick-avatar',
  templateUrl: './pick-avatar.component.html',
  styleUrls: ['./pick-avatar.component.scss'],
})
export class PickAvatarComponent {
  avatar_list: string[] = [
    'frederickbeck.svg',
    'sofiamueller.svg',
    'noahbraun.svg',
    'steffenhoffmann.svg',
    'eliasneumann.svg',
    'eliseroth.svg',
  ];

  picked_avatar: string = 'person.svg';

  chooseAvatar(picked_img: string) {
    this.picked_avatar = picked_img;
  }
}
