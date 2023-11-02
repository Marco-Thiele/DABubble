import { ComponentPortal } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login-components/login/login.component';
import { GeneralViewComponent } from './main-page/general-view-components/general-view/general-view.component';
import { ChannelsComponent } from './main-page/channels-components/channels/channels.component';
import { MainChatComponent } from './main-page/general-view-components/main-chat/main-chat.component';
import { SecondaryChatComponent } from './main-page/general-view-components/secondary-chat/secondary-chat.component';
import { CreateAccountComponent } from './login-components/create-account/create-account.component';
import { PasswordResetComponent } from './login-components/password-reset/password-reset.component';
import { MailPasswordResetComponent } from './login-components/mail-password-reset/mail-password-reset.component';
import { PickAvatarComponent } from './login-components/pick-avatar/pick-avatar.component';
import { ImpressumComponent } from './login-components/impressum/impressum.component';
import { DataPolicyComponent } from './login-components/data-policy/data-policy.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: CreateAccountComponent },
  { path: 'pick-avatar', component: PickAvatarComponent },
  { path: 'recover', component: PasswordResetComponent },
  { path: 'mail-recover', component: MailPasswordResetComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'data-policy', component: DataPolicyComponent },
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
