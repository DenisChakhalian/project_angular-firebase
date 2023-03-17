import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PostService} from "../../shared/post.service";
import {filter, Subscription, switchMap} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Post} from "../../shared/interfaces";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {


  // @ts-ignore
  form: FormGroup = null;
  // @ts-ignore
  post: Post = null;
  submitted = false
  uSub: Array<Subscription> = [];
  error: string = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostService,
    private alert: AlertService
  ) {
  }

  ngOnInit() {
    this.loading = true;
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.postsService.getById(params['id'])
      }),
    ).subscribe((response: any) => {
      this.loading = false;
      if (response) {
        this.post = response;
        this.form = new FormGroup({
          title: new FormControl(response.title, Validators.required),
          text: new FormControl(response.text, Validators.required),
        })
      }

      if (response?.error) {
        this.error = response.error;
      }
      console.log(this.error)
    })
  }

  submit() {
    if (this.form.invalid) return

    this.submitted = true

    this.uSub.push(this.postsService.update({
      ...this.post,
      title: this.form.value.title,
      text: this.form.value.text,
    }).subscribe(() => {
      this.submitted = false
      this.alert.success('Публікацію було змінено!')
    }))
  }

  ngOnDestroy() {
    this.uSub.forEach(sub => {
      sub.unsubscribe();
    })
  }
}
