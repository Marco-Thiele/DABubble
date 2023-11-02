import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelErstellenComponent } from './channel-erstellen.component';

describe('ChannelErstellenComponent', () => {
  let component: ChannelErstellenComponent;
  let fixture: ComponentFixture<ChannelErstellenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChannelErstellenComponent]
    });
    fixture = TestBed.createComponent(ChannelErstellenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
