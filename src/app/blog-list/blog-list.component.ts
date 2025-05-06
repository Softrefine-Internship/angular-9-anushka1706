import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BlogService } from './blog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  allBlog: any[] = [];
  offset = 0;
  limit = 6;
  totalBlogs = 0;
  isLoading = true
  isEndOfList = false;
  categories = ['Love', 'Maths', 'Gaming', 'Programming']
  @ViewChild('blogList') blogList!: ElementRef;

  constructor(private blogService: BlogService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    if (this.isEndOfList) return;
    let scrollPosition = 0;
    if (this.blogList) {
      scrollPosition = this.blogList.nativeElement.scrollTop;
    }
    
    this.blogService.fetchBlogs(this.offset, this.limit).subscribe({
      next: (res) => {
        this.totalBlogs = res.total_blogs;
        if (res.blogs.length === 0 || this.allBlog.length + res.blogs.length >= this.totalBlogs) {
          this.isEndOfList = true;
        }
        this.allBlog.push(...res.blogs);
        console.log(this.offset, this.limit)
        this.isLoading = false;
        
        setTimeout(() => {
          if (this.blogList) {
            this.blogList.nativeElement.scrollTop = scrollPosition;
          }
        }, 0);
      },
      error: (err) => {
        console.log('Error fetching blogs', err);
        this.isLoading = false;
      }
    });
    this.offset += this.limit
  }

  onScroll(event: any): void {
    const element = event.target;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 100) {
      this.loadBlogs();
    }
  }

}