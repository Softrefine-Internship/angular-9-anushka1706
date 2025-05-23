import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User, UserDetail } from './user.model';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({ providedIn: 'root' })

export class AuthService {
    isLoggedIn = false;
    userDetails = new BehaviorSubject<UserDetail>(new UserDetail('', '', ''));
    loggedInUser !: any
    errorMessage !: string
    user = new BehaviorSubject<User | null>(null);
    status = new BehaviorSubject<boolean>(this.isLoggedIn)
    API_KEY = "AIzaSyACNs9Usn6lbyP9ta4jIbdxuaXI57oGaqU";
    SIGNUP_API = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`;
    LOGIN_API = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`;
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {
        const userData = localStorage.getItem('loggedInUser');
        if (userData) {
            this.userDetails.next(JSON.parse(userData));
        }
    }

    signup(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                this.SIGNUP_API,
                {
                    email: email,
                    password: password,
                    returnSecureToken: true
                }
            )
            .pipe(
                catchError(this.handleError),
                tap(resData => {
                    this.handleAuthentication(
                        resData.email,
                        resData.localId,
                        resData.idToken,
                        +resData.expiresIn
                    );
                })
            );
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                this.LOGIN_API,
                {
                    email: email,
                    password: password,
                    returnSecureToken: true
                }
            )
            .pipe(
                catchError(this.handleError),
                tap(resData => {
                    this.handleAuthentication(
                        resData.email,
                        resData.localId,
                        resData.idToken,
                        +resData.expiresIn
                    );
                })
            );
    }

    logout() {
        this.isLoggedIn = false
        this.status.next(this.isLoggedIn)
        this.user.next(null);
        localStorage.removeItem('userData');
        localStorage.removeItem('loggedInUser')
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
        this.router.navigate([''])
    }

    autoLogin() {
        const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
            return;
        }

        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(storedUserData);

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration =
                new Date(userData._tokenExpirationDate).getTime() -
                new Date().getTime();
            this.autoLogout(expirationDuration);
            this.isLoggedIn = true
            this.status.next(this.isLoggedIn)
        }
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(
        email: string,
        userId: string,
        token: string,
        expiresIn: number
    ) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
        this.isLoggedIn = true
        this.status.next(this.isLoggedIn)
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        switch (errorRes.error.error.message) {
            case 'INVALID_LOGIN_CREDENTIALS':
                errorMessage = 'Invalid login credentials';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct.';
                break;
            case 'EMAIL_EXISTS':
            errorMessage = 'This email already exists.'
        }
        return throwError(() => errorMessage);
    }
    
}
