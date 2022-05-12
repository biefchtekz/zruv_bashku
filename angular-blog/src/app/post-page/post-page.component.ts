import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PostsService} from "../shared/posts.service";
import {Observable, switchMap} from "rxjs";
import {Post} from "../shared/interfaces";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../admin/shared/services/alert.service";

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {
  //@ts-ignore
  post$: Observable<Post>
  //@ts-ignore
  form: FormGroup
  //@ts-ignore
  post: Post
  //@ts-ignore
  comments$: Observable<Comment[]>

  constructor(
    private route: ActivatedRoute,
    private postService: PostsService,
    //private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.post$ = this.route.params
      .pipe(switchMap( (params: Params) => {
        return this.postService.getById(params['id']);
      }))
    this.post$.subscribe((post: Post) => {
      this.post = post
      this.comments$ = this.postService.loadComments(this.post.id)
    })

    this.form = new FormGroup({
      commentAuthor: new FormControl(null, Validators.required),
      commentText: new FormControl(null, Validators.required)
    })
  }

  submitComment(){
    if (this.form.invalid) return
    const comment: Comment = {
      // @ts-ignore
      commentAuthor: this.form.value.commentAuthor,
      commentText: this.form.value.commentText,
      commentDate: new Date()
    }

    this.postService.createComment(comment, this.post.id).subscribe(()=>{
      this.form.reset()
      //this.alert.success('Comment added')
    })
  }

}
