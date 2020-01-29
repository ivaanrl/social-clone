import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificationService } from './notification.service';
import { AuthService } from '../auth/auth.service';

export interface TwootContent {
  content: string;
}

@Injectable({ providedIn: 'root' })
export class TwootService {
  twootUrl = 'http://localhost:5000/api/twoot/';
  favUrl = 'http://localhost:5000/api/twoot/fav';
  getFavUrl = 'http://localhost:5000/api/twoot/getFav';
  exploreTwootUrl = 'http://localhost:5000/api/twoot/exploreTwoot/';
  hashtagTwootUrl = 'http://localhost:5000/api/explore/';
  replyTwootUrl = 'http://localhost:5000/api/twoot/reply';
  getMostUsedHashtagsUrl = 'http://localhost:5000/api/explore/mostUsedHashtags';

  regExpHashtag: RegExp = /(#[^ ]+)/;
  regExpUsername: RegExp = /(@[^ ]+)/;
  NewTwootsEmitter = new EventEmitter();

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  getNewTwoots() {
    this.NewTwootsEmitter.emit('getNewTwoots');
  }

  createTwoot(content: string, image) {
    const formData = new FormData();

    let hashtags: string[] = [];
    content.split(' ').forEach(word => {
      if (word.match(this.regExpHashtag)) {
        hashtags.push(word.substr(1));
      } else if (word.match(this.regExpUsername)) {
        this.notificationService.sendNotification(
          this.authService.user.value.getUsername,
          word.substr(1),
          `${this.authService.user.value.getUsername} mentioned you in a twoot!`
        );
      }
    });

    formData.append('date', Date.now().toString());
    formData.append('content', content);
    formData.append('hashtags', hashtags.join(' '));
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

  replyTwoot(content: string, image, parent_twoot_id: string) {
    const formData = new FormData();

    let hashtags: string[] = [];
    content.split(' ').forEach(word => {
      if (word.match(this.regExpHashtag)) {
        hashtags.push(word.substr(1));
      } else if (word.match(this.regExpUsername)) {
        this.notificationService.sendNotification(
          this.authService.user.value.getUsername,
          word.substr(1),
          `${this.authService.user.value.getUsername} mentioned you in a twoot!`
        );
      }
    });

    formData.append('date', Date.now().toString());
    formData.append('content', content);
    formData.append('hashtags', hashtags.join(' '));
    formData.append('parent_twoot_id', parent_twoot_id);
    formData.append('file', image);
    if (content === '') {
      return;
    }

    return this.http.post(this.replyTwootUrl, formData).pipe(
      catchError(this.handleError),
      tap(resData => {
        return resData;
      })
    );
  }

  getTwoots(page: number) {
    return this.http.get(this.twootUrl + page).pipe(
      catchError(this.handleError),
      tap(resData => {
        return resData;
      })
    );
  }

  getExploreTwoots(page: number) {
    return this.http.get(this.exploreTwootUrl + page).pipe(
      catchError(this.handleError),
      tap(resData => {
        return resData;
      })
    );
  }

  getTwootsWithReplies(page: number, parent_id: string) {
    return this.http
      .get(this.replyTwootUrl + '/' + page + '/' + parent_id)
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          return resData;
        })
      );
  }

  getHashtagTwoots(hashtag: string, page: number) {
    return this.http.get(this.hashtagTwootUrl + hashtag + '/' + page).pipe(
      catchError(this.handleError),
      tap(resData => {
        return resData;
      })
    );
  }

  getSearchTwoots(search: string, page: number) {
    return this.http
      .get(this.hashtagTwootUrl + 'search/' + search + '/' + page)
      .pipe(
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

  getMostUsedHashtags() {
    return this.http.get(this.getMostUsedHashtagsUrl).pipe(
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
