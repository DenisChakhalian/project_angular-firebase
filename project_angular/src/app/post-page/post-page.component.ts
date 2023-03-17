import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PostService} from "../shared/post.service";
import {Observable, switchMap, tap} from "rxjs";

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {
  loading: boolean = false;
  error: string = '';
  post$: Observable<any> = this.route.params
    .pipe(
      switchMap((params: Params) => {
        return this.postService.getById(params['id'])
      }),
      tap((data: any) => {
        this.error = data.error;
      })
    )


  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {
  }

  ngOnInit(): void {
  }

}
