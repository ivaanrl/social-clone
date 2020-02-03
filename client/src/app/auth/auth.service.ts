import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { User } from './user.model';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { Router } from '@angular/router';

export interface Form {
  id: string;
}

export interface SignUpForm {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
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
export class AuthService {
  private tokenExpirationTimer: any;
  user = new BehaviorSubject<User>(null);

  signupUrl = 'https://cryptic-anchorage-68791.herokuapp.com/api/signup';
  signInUrl = 'https://cryptic-anchorage-68791.herokuapp.com/api/signin';

  constructor(private http: HttpClient, private router: Router) {}

  signIn(email: string, password: string) {
    return this.http
      .post<Form>(
        this.signInUrl,
        {
          email: email,
          password: password
        },
        httpPostOptions
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(resData);
        })
      );
  }

  signup(
    username: string,
    email: string,
    firstname: string,
    lastname: string,
    password: string
  ) {
    return this.http
      .post<Form>(
        this.signupUrl,
        {
          username,
          email,
          firstname,
          lastname,
          password
        },
        httpPostOptions
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(resData);
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autosignin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData.username,
      userData.profile_pic_name,
      userData.date
    );
    if (loadedUser.date) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData.Date).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
    this.user.next(loadedUser);
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  handleAuthentication(data: any) {
    const user = new User(
      data.email,
      data.id,
      data.username,
      data.profile_pic_name,
      Date.now() + 3600 * 1000
    );
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unkwown error ocurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }
}
