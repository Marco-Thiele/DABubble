import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  private isEditChannelOpen = false;

  getIsEditChannelOpen(): boolean {
    return this.isEditChannelOpen;
  }

  setIsEditChannelOpen(value: boolean): void {
    this.isEditChannelOpen = value;
  }
}
