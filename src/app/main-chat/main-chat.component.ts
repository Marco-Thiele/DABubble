import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss'],
})
export class MainChatComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  showMembers() {}

  addMembers() {}

  onTextareaInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = '40px';
    target.style.height = target.scrollHeight + 'px';
    target.style.paddingBottom = '10px';
  }
}
