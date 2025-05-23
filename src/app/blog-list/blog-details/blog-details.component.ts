import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogDetailsService } from './blogDetails.service';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {

  blogDetailsData !: any
  bloggerDetail !: any
  constructor(private route: ActivatedRoute, private blogDetails: BlogDetailsService, private blogService: BlogService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.getBlog(params['id'])
    });
    this.blogService.visitedetails.next(true)
  }
  getBlog(id: number) {
    this.blogDetails.getDetails(id).subscribe(res => {
      this.blogDetailsData = res.blog;
      this.getBlogger(this.blogDetailsData['user_id'])
    });
  }
  getBlogger(id: number) {
    this.blogDetails.getBloggerDetail(id).subscribe(res => {
      this.bloggerDetail = res.user
    })
  }
}
