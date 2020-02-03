import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificationService } from './notification.service';
import { AuthService } from '../auth/auth.service';

const httpGetOptions = {
  withCredentials: true
};

const httpPostOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }),
  withCredentials: true
};

@Injectable({ providedIn: 'root' })
export class FollowService {
  followCheckUrl =
    'https://cryptic-anchorage-68791.herokuapp.com/api/followers/check';
  followUrl =
    'https://cryptic-anchorage-68791.herokuapp.com/api/followers/follow';
  unfollowUrl =
    'https://cryptic-anchorage-68791.herokuapp.com/api/followers/unfollow';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  isFollowing(follower: string, following: string) {
    return this.http
      .post(this.followCheckUrl, { follower, following }, httpPostOptions)
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          return resData;
        })
      );
  }

  follow(follower: string, following: string) {
    return this.http
      .post(this.followUrl, { follower, following }, httpPostOptions)
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.notificationService.sendNotification(
            follower,
            following,
            `${this.authService.user.value.getUsername} is following you!`
          );
          return resData;
        })
      );
  }

  unfollow(follower: string, following: string) {
    return this.http
      .post(this.unfollowUrl, { follower, following }, httpPostOptions)
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          return resData;
        })
      );
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unkwown error ocurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
    }
    return throwError(errorMessage);
  }
}
