import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  sendNotificationUrl =
    'http://localhost:5000/api/notifications/sendNotification';
  getNotificationsUrl =
    'http://localhost:5000/api/notifications/getNotifications';
  constructor(private http: HttpClient) {}

  sendNotification(sender_username: string, receiver_username: string) {
    let sendNotification = this.http
      .post(this.sendNotificationUrl, { sender_username, receiver_username })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          return resData;
        })
      );
    sendNotification.subscribe(resData => {
      console.log(resData);
    });
  }

  getNotifications(username: string) {
    return this.http.post(this.getNotificationsUrl, { username }).pipe(
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
