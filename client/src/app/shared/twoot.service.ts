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
  favUrl = 'http://localhost:5000/api/twoot/fav';
  getFavUrl = 'http://localhost:5000/api/twoot/getFav';
  getTwootImgUrl = 'http://localhost:5000/api/twoots/getTwootImage/';

  constructor(private http: HttpClient) {}

  createTwoot(content: string, image) {
    const formData = new FormData();
    formData.append('date', Date.now().toString());
    formData.append('content', content);
    formData.append('file', image);
    if (content === '') {
      return;
    }

    return this.http.post(this.twootUrl, formData).pipe(
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
    if (dateTwoot > 60 && dateTwoot < 1440) {
      dateTwoot /= 60;
      dateTwoot = Math.floor(dateTwoot);

      dateTwoot = `${dateTwoot}h`;
    } else if (dateTwoot > 1440) {
      dateTwoot /= 1440;
      dateTwoot = Math.floor(dateTwoot);
      dateTwoot = `${dateTwoot}d`;
    } else {
      dateTwoot = Math.floor(dateTwoot);
      dateTwoot = `${dateTwoot}m`;
    }
    return dateTwoot;
  }

  favClick(twoot_id: string, username: string) {
    return this.http.post(this.favUrl, { twoot_id, username }).pipe(
      catchError(this.handleError),
      tap(resData => {
        return resData;
      })
    );
  }

  getFav(twoot_id: string, username: string) {
    return this.http.post(this.getFavUrl, { twoot_id, username }).pipe(
      catchError(this.handleError),
      tap(resData => {
        return resData;
      })
    );
  }

  //getTwootImg(img_name: string, user_id: string) {
  //  return this.http
  //    .post(this.getTwootImgUrl + `${img_name}`, { user_id })
  //    .pipe(
  //      catchError(this.handleError),
  //      tap(resData => {
  //        console.log(resData);
  //        return resData;
  //      })
  //    );
  //}

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = errorRes;
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
