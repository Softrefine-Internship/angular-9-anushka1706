import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserActivityService {
    API = 'https://ng-blog-eb232-default-rtdb.asia-southeast1.firebasedatabase.app/activity';
    userActivity = new BehaviorSubject<{ liked: number[]; bookmarked: number[] }>({ liked: [], bookmarked: [] });
    error !: string

    constructor(private http: HttpClient, private auth: AuthService) {
        this.auth.userDetails.subscribe(() => {
            this.fetchUserActivity();
        });
    }

    updateActivity(blogId: number, action: string) {
        const user = this.auth.userDetails.getValue();
        const userId = user.id;

        if (!userId) {
            console.error('User not logged in');
            return;
        }

        this.http.get<any>(`${this.API}/${userId}.json`).subscribe(currentData => {
            let liked: number[] = currentData?.liked || [];
            let bookmarked: number[] = currentData?.bookmarked || [];

            if (action === 'like') {
                if (liked.includes(blogId)) {
                    liked = liked.filter((id: number) => id !== blogId);
                } else {
                    liked.push(blogId);
                }
            }

            if (action === 'bookmark') {
                if (bookmarked.includes(blogId)) {
                    bookmarked = bookmarked.filter((id: number) => id !== blogId);
                } else {
                    bookmarked.push(blogId);
                }
            }

            const updatedData = {
                liked: liked,
                bookmarked: bookmarked
            };

            this.http.put<any>(`${this.API}/${userId}.json`, updatedData).subscribe(
                res => {
                    console.log(`Updated ${action}:`, res);
                },
                error => {
                    this.error = error;
                }
            );
        });
    }

    fetchUserActivity() {
        const user = this.auth.userDetails.getValue();
        const userId = user?.id;

        if (!userId) {
            return;
        }

        this.http.get<any>(`${this.API}/${userId}.json`).subscribe(data => {
            console.log(data, userId)
            this.userActivity.next({
                liked: data?.liked || [],
                bookmarked: data?.bookmarked || []
            });
        });
    }
}
