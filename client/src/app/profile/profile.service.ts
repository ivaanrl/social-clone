import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  userTwootsUrl = 'http://localhost:5000/api/userTwoots';
  profileInfoUrl = 'http://localhost:5000/api/profile/basicInfo';

  constructor(private http: HttpClient) {}

  getUserTwoots(username: string) {
    return this.http.post(this.userTwootsUrl, { username }).pipe(
      catchError(this.handleError),
      tap(resData => {
        return resData;
      })
    );
  }

  getProfileInfo(username: string) {
    return this.http.post(this.profileInfoUrl, { username }).pipe(
      catchError(this.handleError),
      tap(resData => {
        return resData;
      })
    );
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = errorRes;
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
