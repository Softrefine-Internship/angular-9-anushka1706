import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  constructor(private router: Router, private auth: AuthService) { }

  loggedIn: boolean = false
  username !: string

  ngOnInit(): void {
    this.checkStatus()
     this.auth.userDetails.subscribe(res => {
      this.username = res.firstname + " " + res.lastname
    })
  }

  checkStatus() {
    this.auth.status.subscribe(status => {
      this.loggedIn = status;
    });
  }

  onLogin() {
    this.router.navigate(['auth'], { queryParams: { mode: 'login' } });
  }

  onSignup() {
    this.router.navigate(['auth'], { queryParams: { mode: 'signup' } });
  }

  onLogout() {
    this.auth.logout()
    this.checkStatus()
  }
  get userInitials(): string {
    if (!this.username) return '';
    const names = this.username.trim().split(' ');
    const firstInitial = names[0]?.charAt(0).toUpperCase() || '';
    const lastInitial = names.length > 1 ? names[names.length - 1]?.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
}

}
