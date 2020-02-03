import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

const httpPostOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }),
  withCredentials: true
};

@Injectable({ providedIn: 'root' })
export class ProfileService {
  userTwootsUrl =
    'https://cryptic-anchorage-68791.herokuapp.com/api/userTwoots';
  profileInfoUrl =
    'https://cryptic-anchorage-68791.herokuapp.com/api/profile/basicInfo';
  saveProfileChangesUrl =
    'https://cryptic-anchorage-68791.herokuapp.com/api/profile/saveChanges';

  constructor(private http: HttpClient) {}

  getUserTwoots(username: string, page: number) {
    return this.http
      .post(this.userTwootsUrl, { username, page }, httpPostOptions)
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          return resData;
        })
      );
  }

  getProfileInfo(username: string) {
    return this.http
      .post(this.profileInfoUrl, { username }, httpPostOptions)
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          return resData;
        })
      );
  }

  async saveProfileChanges(image_object: {
    uploadCoverPic: string;
    uploadProfilePic: string;
  }) {
    return this.http
      .post(
        this.saveProfileChangesUrl,
        {
          profilePic: image_object.uploadProfilePic,
          coverPic: image_object.uploadCoverPic
        },
        httpPostOptions
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          return resData;
        })
      );
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = errorRes;
    return throwError(errorMessage);
  }
}
