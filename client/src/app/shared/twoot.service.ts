import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { Twoot } from './twoot.model';

export interface TwootContent {
  content: string;
}

@Injectable({ providedIn: 'root' })
export class TwootService {
  twoot = new BehaviorSubject<Twoot>(null);
  twootUrl = 'http://localhost:5000/api/twoot';
  constructor(private http: HttpClient) {}

  createTwoot(content: string) {
    if (content === '') {
      return;
    }
    return this.http
      .post<Twoot>(this.twootUrl, { content: content })
      .pipe(
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

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = errorRes;
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
