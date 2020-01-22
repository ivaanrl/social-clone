import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Form, AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  error: string = null;
  isLoading: boolean = false;
  @ViewChild('signupForm', null) signupForm: NgForm;

  signup: {};

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.signup = {
      username: '',
      email: '',
      firstname: '',
      lastname: '',
      password: ''
    };
  }

  onSubmit() {
    if (!this.signupForm.valid) {
      return;
    }
    let signupObs: Observable<Form>;
    signupObs = this.authService.signup(
      this.signupForm.value.username,
      this.signupForm.value.email,
      this.signupForm.value.firstname,
      this.signupForm.value.lastname,
      this.signupForm.value.password
    );
    signupObs.subscribe(
      resData => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      errorMessage => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
    this.signupForm.reset();
  }
}
