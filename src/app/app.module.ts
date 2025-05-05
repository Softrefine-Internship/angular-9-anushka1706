import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { HeaderComponent } from './header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HeroComponent } from './hero/hero.component';
import { ContentPlaceholderComponent } from './content-placeholder/content-placeholder.component';
import { BlogItemComponent } from './blog-list/blog-item/blog-item.component';
import { BlogDetailsComponent } from './blog-list/blog-details/blog-details.component';
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    BlogListComponent,
    HeaderComponent,
    HeroComponent,
    ContentPlaceholderComponent,
    BlogItemComponent,
    BlogDetailsComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
