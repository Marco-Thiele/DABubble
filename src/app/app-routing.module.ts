import { ComponentPortal } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GeneralViewComponent } from './general-view/general-view.component';
import { ChannelsComponent } from './channels/channels.component';
import { MainChatComponent } from './main-chat/main-chat.component';
import { SecondaryChatComponent } from './secondary-chat/secondary-chat.component';
import { CreateAccountComponent } from './create-account/create-account.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: CreateAccountComponent},
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
