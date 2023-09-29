import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChannelsComponent implements OnInit {
  panelOpenState = false;
  isClicked = false;

  constructor() {}

  ngOnInit(): void {}

  openMenuChannels() {
    this.isClicked = !this.isClicked;
  }
  openDirectMessages() {
    this.isClicked = !this.isClicked;
  }

  openNewChannel() {}
}
