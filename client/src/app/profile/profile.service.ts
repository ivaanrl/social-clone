import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  userTwootsUrl = 'http://localhost:5000/api/userTwoots';
  profileInfoUrl = 'http://localhost:5000/api/profile/basicInfo';
  saveProfileChangesUrl = 'http://localhost:5000/api/profile/saveChanges';

  constructor(private http: HttpClient) {}

  getUserTwoots(username: string, page: number) {
    return this.http.post(this.userTwootsUrl, { username, page }).pipe(
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

  saveProfileChanges(profilePic, coverPic) {
    const formData = new FormData();
    formData.append('profilepic', profilePic);
    formData.append('coverpic', coverPic);
    return this.http.post(this.saveProfileChangesUrl, formData).pipe(
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
