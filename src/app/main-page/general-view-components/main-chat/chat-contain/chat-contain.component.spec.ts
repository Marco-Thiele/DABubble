import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatContainComponent } from './chat-contain.component';

describe('ChatContainComponent', () => {
  let component: ChatContainComponent;
  let fixture: ComponentFixture<ChatContainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatContainComponent]
    });
    fixture = TestBed.createComponent(ChatContainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
