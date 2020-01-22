import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  signInUrl = 'http://localhost:5000/api/signin';
  signupUrl = 'http://localhost:5000/api/signup';

  constructor(private http: HttpClient, private router: Router) {}

  signIn(email: string, password: string) {
    return this.http
      .post<Form>(this.signInUrl, {
        email: email,
        password: password
      })
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
      .post<Form>(this.signupUrl, {
        username,
        email,
        firstname,
        lastname,
        password
      })
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
  }

  autosignin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User('email', userData);
    //NEED TO CHECK FOR TOKEN EXPIRATION DATE
    this.user.next(loadedUser);
  }

  handleAuthentication(data: any) {
    const user = new User(data.email, data.id);
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
