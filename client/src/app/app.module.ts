import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { TwootComponent } from './twoot/twoot.component';
import { MessagesComponent } from './messages/messages.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ExploreComponent } from './explore/explore.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { TwootPipe } from './twoot/twoot.pipe';
import { CreateTwootComponent } from './create-twoot/create-twoot.component';
import { HashtagExploreComponent } from './hashtag-explore/hashtag-explore.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AlertComponent } from './shared/alert/alert.component';
import { TwootWithRepliesComponent } from './twoot-with-replies/twoot-with-replies.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { SearchComponent } from './search/search.component';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { Cloudinary as CloudinaryCore } from 'cloudinary-core';
import { FileUploadModule } from 'ng2-file-upload';

export const cloudinary = {
  Cloudinary: CloudinaryCore
};

@NgModule({
  declarations: [
    AppComponent,

    AuthComponent,
    HomeComponent,
    NavbarComponent,
    SignupComponent,
    ProfileComponent,
    TwootComponent,
    MessagesComponent,
    NotificationsComponent,
    ExploreComponent,
    LoadingSpinnerComponent,
    TwootPipe,
    CreateTwootComponent,
    HashtagExploreComponent,
    AlertComponent,
    TwootWithRepliesComponent,
    RightSidebarComponent,
    SearchComponent
  ],
  imports: [
    FileUploadModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    InfiniteScrollModule,
    CloudinaryModule.forRoot(cloudinary, {
      cloud_name: 'twitter-clone',
      upload_preset: 'mvdq7dxs'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
