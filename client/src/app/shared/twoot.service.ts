import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

export interface TwootContent {
  content: string;
}

@Injectable({ providedIn: 'root' })
export class TwootService {
  twootUrl = 'http://localhost:5000/api/twoot';

  constructor(private http: HttpClient) {}

  createTwoot(content: string) {
    if (content === '') {
      return;
    }
    return this.http.post(this.twootUrl, { content: content }).pipe(
      catchError(this.handleError),
      tap(resData => {
        return resData;
      })
    );
  }

  getTwoots() {
    return this.http.get(this.twootUrl).pipe(
      catchError(this.handleError),
      tap(resData => {
        return resData;
      })
    );
  }

  getTimeDifference(twootTime: string) {
    let dateTwoot: number | string =
      (Date.now() - Date.parse(twootTime)) / 1000 / 60;
    if (dateTwoot > 60) {
      dateTwoot /= 60;
      dateTwoot = Math.floor(dateTwoot);

      dateTwoot = `${dateTwoot}h`;
    } else {
      dateTwoot = Math.floor(dateTwoot);
      dateTwoot = `${dateTwoot}m`;
    }
    return dateTwoot;
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = errorRes;
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
