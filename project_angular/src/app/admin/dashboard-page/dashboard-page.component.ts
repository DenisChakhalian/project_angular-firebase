import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from "../../shared/post.service";
import {Post} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  posts: Post[] = []
  pSub: Array<Subscription> = [];
  searchStr = ''

  constructor(
    private postService: PostService,
    private alert: AlertService
  ) {
  }

  ngOnInit(): void {
    this.pSub.push(
      this.postService.getAll().subscribe(posts => {
        this.posts = posts
      })
    )
  }

  ngOnDestroy(): void {
    this.pSub.forEach(sub => {
      sub.unsubscribe();
    })
  }

  remove(id: string) {
    this.pSub.push(this.postService.remove(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id)
      this.alert.success('Публікацію було видалено!')
    }))
  }
}
