import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Post} from "../../shared/interfaces";
import {PostService} from "../../shared/post.service";
import {AlertService} from "../shared/services/alert.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {

  form: FormGroup = new FormGroup<any>({
    title: new FormControl(null, Validators.required),
    text: new FormControl(null, Validators.required),
    author: new FormControl(null, Validators.required),
  })

  constructor(
    private postsService: PostService,
    private alert : AlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  submit() {
    if(this.form.invalid) return
    const post: Post = {
      title:this.form.value.title,
      author:this.form.value.author,
      text:this.form.value.text,
      date: new Date()
    }
    this.postsService.create(post).subscribe(()=> {
      this.form.reset()
      this.alert.success('Публікація була створена!')
      this.router.navigate(['/admin'])
    })
  }

}
