import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';;
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class BlogService {
    API = "https://api.slingacademy.com/v1/sample-data/blog-posts"
    error !: string
    allBlogs: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
    scrollPosition: BehaviorSubject<number> = new BehaviorSubject<number>(0)
    currentTotalBlogs: BehaviorSubject<number> = new BehaviorSubject<number>(0)
    visitedetails: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

    constructor(private http: HttpClient) { }
    fetchBlogs(offset: number, limit: number) {
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