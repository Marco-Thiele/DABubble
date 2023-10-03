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
import { GeneralViewComponent } from './general-view/general-view.component';
import { ChannelsComponent } from './channels/channels.component';
import { MainChatComponent } from './main-chat/main-chat.component';
import { SecondaryChatComponent } from './secondary-chat/secondary-chat.component';
import { LoginComponent } from './login/login.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderComponent } from './header/header.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { MailPasswordResetComponent } from './mail-password-reset/mail-password-reset.component';
import { PickAvatarComponent } from './pick-avatar/pick-avatar.component';
import { ChannelErstellenComponent } from './channel-erstellen/channel-erstellen.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ChannelEditComponent } from './channel-edit/channel-edit.component';
import { SharedService } from './shared.service';
import { ChannelMembersComponent } from './channel-members/channel-members.component';
import { ProfilComponent } from './profil/profil.component';
import { AddChannelMembersComponent } from './add-channel-members/add-channel-members.component';
import { EditProfilComponent } from './edit-profil/edit-profil.component';

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
  ],
  providers: [SharedService],
  bootstrap: [AppComponent],
})
export class AppModule {}
