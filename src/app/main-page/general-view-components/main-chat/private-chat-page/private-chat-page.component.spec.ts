import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateChatPageComponent } from './private-chat-page.component';

describe('PrivateChatPageComponent', () => {
  let component: PrivateChatPageComponent;
  let fixture: ComponentFixture<PrivateChatPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrivateChatPageComponent]
    });
    fixture = TestBed.createComponent(PrivateChatPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
