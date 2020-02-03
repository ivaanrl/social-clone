import { Component, OnInit } from '@angular/core';
import { AuthService, Form } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  password: string = '';
  email: string = '';
  isLoading: boolean = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  signin() {
    this.authService.signIn(this.email, this.password);
    let authObs: Observable<Form>;
    this.isLoading = true;
    authObs = this.authService.signIn(this.email, this.password);
    authObs.subscribe(
      resData => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      errorMessage => {
        if (errorMessage === 'An unkwown error ocurred!') {
          this.error = 'Incorrect email/username or password';
          this.isLoading = false;
        }
      }
    );
  }
}
