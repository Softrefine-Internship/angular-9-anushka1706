import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogListComponent } from './blog-list/blog-list.component';
import { AuthComponent } from './auth/auth.component';
import { HeroComponent } from './hero/hero.component';
import { AuthGuard } from './auth/authGuard';
import { BlogDetailsComponent } from './blog-list/blog-details/blog-details.component';

const routes: Routes = [

    {
        path: '',
        component: HeroComponent,
    },
    {
        path: 'auth',
        component: AuthComponent,
    },
    {
        path: 'bloglist',
        component: BlogListComponent,
        canActivate: [AuthGuard]

    }, {
        path: 'bloglist/details',
        component: BlogDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }