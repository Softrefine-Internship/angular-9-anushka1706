import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';


@Injectable({ providedIn: 'root' })

export class UserStorage {
    API = "https://ng-blog-eb232-default-rtdb.asia-southeast1.firebasedatabase.app/"

    constructor(private http: HttpClient, private auth: AuthService) { }

    save() {
        const userData = this.auth.userDetails.getValue()
        this.http.put<any>(`${this.API}/users/${userData.id}.json`, {
            firstname: userData.firstname,
            lastname: userData.lastname,
            id: userData.id
        }).subscribe()
    }

    getUser(id: string) {
        return this.http.get<any>(`${this.API}/users/${id}.json`)
    }

}