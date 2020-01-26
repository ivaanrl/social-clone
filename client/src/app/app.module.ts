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
    TwootPipe
  ],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
