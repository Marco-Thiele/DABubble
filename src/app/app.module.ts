import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { GeneralViewComponent } from './main-page/general-view-components/general-view/general-view.component';
import { ChannelsComponent } from './main-page/channels-components/channels/channels.component';
import { MainChatComponent } from './main-page/general-view-components/main-chat/main-chat.component';
import { SecondaryChatComponent } from './main-page/general-view-components/secondary-chat/secondary-chat.component';
import { LoginComponent } from './login-components/login/login.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderComponent } from './main-page/general-view-components/header/header.component';
import { CreateAccountComponent } from './login-components/create-account/create-account.component';
import { PasswordResetComponent } from './login-components/password-reset/password-reset.component';
import { MailPasswordResetComponent } from './login-components/mail-password-reset/mail-password-reset.component';
import { PickAvatarComponent } from './login-components/pick-avatar/pick-avatar.component';
import { ChannelErstellenComponent } from './main-page/channels-components/channel-erstellen/channel-erstellen.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ChannelEditComponent } from './main-page/channels-components/channel-edit/channel-edit.component';
import { SharedService } from './services/shared.service';
import { ChannelMembersComponent } from './main-page/channels-components/channel-members/channel-members.component';
import { ProfilComponent } from './main-page/profils-components/profil/profil.component';
import { AddChannelMembersComponent } from './main-page/channels-components/add-channel-members/add-channel-members.component';
import { EditProfilComponent } from './main-page/profils-components/edit-profil/edit-profil.component';
import { NewChannelMembersComponent } from './main-page/channels-components/new-channel-members/new-channel-members.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { UserProfilComponent } from './main-page/profils-components/user-profil/user-profil.component';
import { ImpressumComponent } from './login-components/impressum/impressum.component';
import { DataPolicyComponent } from './login-components/data-policy/data-policy.component';
import { CommonModule, DatePipe } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { PrincipalPageComponent } from './main-page/general-view-components/main-chat/principal-page/principal-page.component';
import { ChannelsPageComponent } from './main-page/general-view-components/main-chat/channels-page/channels-page.component';
import { PrivateChatPageComponent } from './main-page/general-view-components/main-chat/private-chat-page/private-chat-page.component';
import { BoxToWriteComponent } from './main-page/general-view-components/main-chat/box-to-write/box-to-write.component';
import { ChatContainComponent } from './main-page/general-view-components/main-chat/chat-contain/chat-contain.component';

@NgModule({
  declarations: [
    AppComponent,
    GeneralViewComponent,
    ChannelsComponent,
    MainChatComponent,
    SecondaryChatComponent,
    LoginComponent,
    HeaderComponent,
    CreateAccountComponent,
    PasswordResetComponent,
    MailPasswordResetComponent,
    PickAvatarComponent,
    ChannelErstellenComponent,
    ChannelEditComponent,
    ChannelMembersComponent,
    ProfilComponent,
    AddChannelMembersComponent,
    EditProfilComponent,
    UserProfilComponent,
    ImpressumComponent,
    DataPolicyComponent,
    PrincipalPageComponent,
    ChannelsPageComponent,
    PrivateChatPageComponent,
    BoxToWriteComponent,
    ChatContainComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatProgressBarModule,
    MatCardModule,
    MatMenuModule,
    MatExpansionModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    PickerModule,
    NewChannelMembersComponent,
    MatCheckboxModule,
    MatRadioModule,
    CommonModule,
    DatePipe,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'de' }, SharedService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    registerLocaleData(localeDe, 'de');
  }
}
