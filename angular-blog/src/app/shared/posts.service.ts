import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {fbCreateResponse, Post} from "./interfaces";
import {environment} from "../../environments/environment";

@Injectable({providedIn: "root"})
export class PostsService {
  constructor(private http: HttpClient) {}

  create(post: Post): Observable<Post>{
    return this.http.post<Post>(`${environment.fbDbUrl}/posts.json`, post)
      //@ts-ignore
      .pipe(map((response: fbCreateResponse) => {
        return {
          ...post,
          id: response.name,
          date: new Date(post.date)
        }
      }))
  }

  createComment(comment: Comment, postId: string | undefined): Observable<Comment> {
    return this.http.post<Comment>(`${environment.fbDbUrl}/posts/${postId}/comments.json`, comment)
  }

  loadComments(postId: string | undefined): Observable<Comment[]> {
    return this.http.get(`${environment.fbDbUrl}/posts/${postId}/comments.json`)
      .pipe(map( (response: {[key: string]: any}) => {
        return Object.keys(response).map(key => ({
          ...response[key],
          id: key,
          date: new Date(response[key].date)
        }))
      }))
  }

  getAll(): Observable<Post[]>{
    return this.http.get(`${environment.fbDbUrl}/posts.json`)
      .pipe(map( (response: {[key: string]: any}) => {
        return Object.keys(response).map(key => ({
          ...response[key],
          id: key,
          date: new Date(response[key].date)
        }))
      }))
  }

  getById(id: string): Observable<Post> {
    return this.http.get<Post>(`${environment.fbDbUrl}/posts/${id}.json`)
      //@ts-ignore
      .pipe(map((post: Post) => {
        return {
          ...post,
          id,
          date: new Date(post.date)
        }
      }))
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`)
  }

  removeComment(commentId: string, postId: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}/posts/${postId}/comments/${commentId}.json`)
  }

  update(post: Post): Observable<Post>{
    return this.http.patch<Post>(`${environment.fbDbUrl}/posts/${post.id}.json`, post)
  }

}
