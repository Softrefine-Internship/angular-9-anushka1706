import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';;
import { catchError} from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class BlogService {
    API = "https://api.slingacademy.com/v1/sample-data/blog-posts"
    error !: string

    constructor(private http: HttpClient) { }
    fetchBlogs(offset:number, limit: number) {
        return this.http.get<any>(`${this.API}?offset=${offset}&limit=${limit}`).pipe(
            catchError(this.handleError)
        );
    }
    private handleError(error: any) {
        let errorMessage = 'An unknown error occurred!';
        if (error && typeof error.status !== 'undefined' && typeof error.message === 'string') {
            errorMessage = `Error: ${error.status}, Message: ${error.message}`;
        }
        return throwError(() => errorMessage);
    }

}