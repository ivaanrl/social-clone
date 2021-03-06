import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { MessagesComponent } from './messages/messages.component';
import { ExploreComponent } from './explore/explore.component';
import { HashtagExploreComponent } from './hashtag-explore/hashtag-explore.component';
import { TwootWithRepliesComponent } from './twoot-with-replies/twoot-with-replies.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: 'explore',
    component: ExploreComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuard]
  },
  { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
  {
    path: 'explore/:hashtag',
    component: HashtagExploreComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'twoot/:twoot_id',
    component: TwootWithRepliesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'search/:searchContent',
    component: SearchComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':user',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
