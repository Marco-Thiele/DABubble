import { ComponentPortal } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GeneralViewComponent } from './general-view/general-view.component';
import { ChannelsComponent } from './channels/channels.component';
import { MainChatComponent } from './main-chat/main-chat.component';
import { SecondaryChatComponent } from './secondary-chat/secondary-chat.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { MailPasswordResetComponent } from './mail-password-reset/mail-password-reset.component';
import { PickAvatarComponent } from './pick-avatar/pick-avatar.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: CreateAccountComponent },
  { path: 'pick-avatar', component: PickAvatarComponent },
  { path: 'recover', component: PasswordResetComponent },
  { path: 'mail-recover', component: MailPasswordResetComponent },
  {
    path: 'index',
    component: GeneralViewComponent,
    children: [
      { path: 'channels', component: ChannelsComponent },
      { path: 'main-chat', component: MainChatComponent },
      { path: 'secondary-chat', component: SecondaryChatComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
