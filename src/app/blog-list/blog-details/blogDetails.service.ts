import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BlogDetailsService {
    constructor(private http: HttpClient) { }

    API = "https://api.slingacademy.com/v1/sample-data/blog-posts"
    EDITOR_API = " https://api.slingacademy.com/v1/sample-data/users"

    getDetails(id: number) {
        return this.http.get<any>(`${this.API}/${id}`);
    }
    getBloggerDetail(id: number) {
        return this.http.get<any>(`${this.EDITOR_API}/${id}`);
    }
}
