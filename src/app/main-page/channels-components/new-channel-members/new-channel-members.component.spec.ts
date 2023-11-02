import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewChannelMembersComponent } from './new-channel-members.component';

describe('NewChannelMembersComponent', () => {
  let component: NewChannelMembersComponent;
  let fixture: ComponentFixture<NewChannelMembersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewChannelMembersComponent]
    });
    fixture = TestBed.createComponent(NewChannelMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
