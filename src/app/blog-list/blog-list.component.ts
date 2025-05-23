import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BlogService } from './blog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserActivityService } from '../userActivity.service';

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
  scrollPosition !: number
  visitedDetails !: boolean
  @ViewChild('blogList') blogList!: ElementRef;

  constructor(private blogService: BlogService, private router: Router, private route: ActivatedRoute, private userActivity: UserActivityService) { }

  ngOnInit(): void {
    this.userActivity.fetchUserActivity()
    this.visitedDetails = this.blogService.visitedetails.getValue()
    if (this.visitedDetails) {
      this.loadPrevious()
    }
    this.blogService.scrollPosition.subscribe(position => {
      this.scrollPosition = position
    })
    this.loadBlogs();
  }

  loadBlogs(): void {
    if (this.isEndOfList) return;
    let scrollPosition = this.blogService.scrollPosition.getValue() | 0
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
        this.blogService.allBlogs.next(this.allBlog)
        this.offset += this.limit
        this.limit = 6
        this.isLoading = false;

        setTimeout(() => {
          if (this.blogList) {
            this.blogList.nativeElement.scrollTop = scrollPosition;
            this.blogService.scrollPosition.next(this.blogList.nativeElement.scrollTop)
          }
        }, 0);
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  onScroll(event: any): void {
    const element = event.target;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 1) {
      this.loadBlogs();
    }
  }
  loadPrevious() {
    this.limit = this.blogService.allBlogs.getValue().length
    this.offset = 0
  }
}