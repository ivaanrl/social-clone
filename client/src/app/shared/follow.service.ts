import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificationService } from './notification.service';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class FollowService {
  followCheckUrl = 'http://localhost:5000/api/followers/check';
  followUrl = 'http://localhost:5000/api/followers/follow';
  unfollowUrl = 'http://localhost:5000/api/followers/unfollow';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  isFollowing(follower: string, following: string) {
    return this.http.post(this.followCheckUrl, { follower, following }).pipe(
      catchError(this.handleError),
      tap(resData => {
        return resData;
      })
    );
  }

  follow(follower: string, following: string) {
    return this.http.post(this.followUrl, { follower, following }).pipe(
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
    return this.http.post(this.unfollowUrl, { follower, following }).pipe(
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
