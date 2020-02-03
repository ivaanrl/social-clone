import { Injectable, EventEmitter } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificationService } from './notification.service';
import { AuthService } from '../auth/auth.service';
import { Twoot } from './twoot.interface';

export interface TwootContent {
  content: string;
}

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
export class TwootService {
  twootUrl = 'https://cryptic-anchorage-68791.herokuapp.com/api/twoot/';
  favUrl = 'https://cryptic-anchorage-68791.herokuapp.com/api/twoot/fav';
  getFavUrl = 'https://cryptic-anchorage-68791.herokuapp.com/api/twoot/getFav';
  exploreTwootUrl =
    'https://cryptic-anchorage-68791.herokuapp.com/api/twoot/exploreTwoot/';
  hashtagTwootUrl =
    'https://cryptic-anchorage-68791.herokuapp.com/api/explore/';
  replyTwootUrl =
    'https://cryptic-anchorage-68791.herokuapp.com/api/twoot/reply';
  getMostUsedHashtagsUrl =
    'https://cryptic-anchorage-68791.herokuapp.com/api/explore/mostUsedHashtags';

  regExpHashtag: RegExp = /(#[^ ]+)/;
  regExpUsername: RegExp = /(@[^ ]+)/;
  NewTwootsEmitter = new EventEmitter();
  NewTwootEmitter = new EventEmitter();

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  getNewTwoots() {
    this.NewTwootsEmitter.emit('getNewTwoots');
  }

  getNewTwoot(twoot: Twoot) {
    this.NewTwootEmitter.emit(twoot);
  }

  createTwoot(content: string, image) {
    let hashtags: string = '';
    content.split(' ').forEach(word => {
      if (word.match(this.regExpHashtag)) {
        hashtags += ' ' + word.substr(1);
      } else if (word.match(this.regExpUsername)) {
        this.notificationService.sendNotification(
          this.authService.user.value.getUsername,
          word.substr(1),
          `${this.authService.user.value.getUsername} mentioned you in a twoot!`
        );
      }
    });
    if (content === '') {
      return;
    }
    return this.http
      .post(
        this.twootUrl,
        {
          date: Date.now().toString(),
          content: content,
          hashtags,
          image
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

  replyTwoot(content: string, image, parent_twoot_id: string) {
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
    if (content === '') {
      return;
    }

    return this.http
      .post(
        this.replyTwootUrl,
        {
          date: Date.now().toString(),
          content,
          image,
          parent_twoot_id,
          hashtags
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

  getTwoots(page: number) {
    return this.http.get(this.twootUrl + page, httpGetOptions).pipe(
      catchError(this.handleError),
      tap(resData => {
        return resData;
      })
    );
  }

  getExploreTwoots(page: number) {
    return this.http.get(this.exploreTwootUrl + page, httpGetOptions).pipe(
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
    return this.http
      .get(this.hashtagTwootUrl + hashtag + '/' + page, httpGetOptions)
      .pipe(
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
      (Date.now() - parseInt(twootTime, 10)) / 1000 / 60;
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
    return this.http
      .post(this.favUrl, { twoot_id, username }, httpPostOptions)
      .pipe(
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
    return this.http.get(this.getMostUsedHashtagsUrl, httpGetOptions).pipe(
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
