import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../../interfaces";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PostsService} from "../../posts.service";
import {Observable, switchMap} from "rxjs";
import {ActivatedRoute, Params, Router, RouterModule} from "@angular/router";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  //@ts-ignore
  post$: Observable<Post>
  //@ts-ignore
  form: FormGroup
  //@ts-ignore
  @Input() post: Post
  //@ts-ignore
  comments$: Observable<Comment[]>



  constructor(
    private postService: PostsService,
    private route: ActivatedRoute
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
    })
  }

  removeComment(postId: string | undefined, commentId: string) {
    this.postService.removeComment(commentId, postId)
  }

}
