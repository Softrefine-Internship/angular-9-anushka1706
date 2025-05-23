import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserDetail } from './user.model';
import { tap } from 'rxjs';
import { UserStorage } from './userStorage.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})

export class AuthComponent implements OnInit {
  loginForm !: FormGroup;
  error !: string
  signupForm !: FormGroup
  mode: 'login' | 'signup' = 'login';
  showPassword = false;
  showConfirmPassword = false
  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router, private userStorage: UserStorage) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'] === 'signup' ? 'signup' : 'login';
    });
    this.buildForm()
  }

  buildForm() {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(15)])
    });

    this.signupForm = new FormGroup({
      'signupFirstname': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      'signupLastname': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      'signupEmail': new FormControl(null, [Validators.required, Validators.email]),
      'signupPassword': new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(15)]),
      'signupConfirmPassword': new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(15)])
    });
  }

  togglePassword(mode: string) {
    (mode === 'pwd') ? this.showPassword = !this.showPassword : this.showConfirmPassword = !this.showConfirmPassword
  }

  onSubmit() {
    if (this.mode === 'login') {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password
      this.authService.login(email, password).subscribe(
        {
          next: (res) => {
            const loggedUserData = this.authService.user.getValue()
            if (loggedUserData) {
              this.userStorage.getUser(loggedUserData.id).subscribe(res => {
                this.authService.userDetails.next(res)
                localStorage.setItem('loggedInUser', JSON.stringify(res));
              })
            }
            this.router.navigate(['bloglist']);
          },
          error: (err) => {
            this.error = err;

          }
        }
      )
    }
    else if (this.mode === 'signup') {
      const email = this.signupForm.value.signupEmail;
      const password = this.signupForm.value.signupPassword
      const firstname = this.signupForm.value.signupFirstname
      const lastname = this.signupForm.value.signupLastname
      this.authService.signup(email, password).pipe(
        tap(() => {
          const data = this.authService.user.getValue()
          if (data) {
            const userDetails = new UserDetail(firstname, lastname, data.id)
            this.authService.userDetails.next(userDetails);
            this.userStorage.save();
          }
        })
      ).subscribe({
        next: (res) => {
          this.router.navigate(['bloglist']);
        },
        error: (err) => {
          this.error = err
        }
      })
    }
  }
}
