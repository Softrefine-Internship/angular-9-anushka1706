import { Component, Input, OnInit } from '@angular/core';
import { UserActivityService } from 'src/app/userActivity.service';
import { BlogService } from '../blog.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blog-item',
  templateUrl: './blog-item.component.html',
  styleUrls: ['./blog-item.component.scss']
})
export class BlogItemComponent implements OnInit {
  @Input() blogItems !: any
  @Input() categories !: string[]
  isLiked !: boolean
  isBookMarked !: boolean
  constructor(private activitySevice: UserActivityService, private blogService: BlogService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activitySevice.userActivity.subscribe(activity => {
      this.isLiked = activity.liked.includes(this.blogItems.id);
      this.isBookMarked = activity.bookmarked.includes(this.blogItems.id);
      console.log(this.isLiked)
    });
  }

  onBlogClick(id: number) {
    console.log(id)
    this.router.navigate(['details'], {
      relativeTo: this.route,
      queryParams: { id }
    });
  }

  updateActivity(id: number, action: string) {
    if (action === 'like') this.isLiked = !this.isLiked
    if (action === 'bookmark') this.isBookMarked = !this.isBookMarked
    this.activitySevice.updateActivity(id, action)
  }
}
