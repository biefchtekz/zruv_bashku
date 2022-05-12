import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, Subject, tap, throwError} from "rxjs";
import {FbAuthResponse, User} from "../../../shared/interfaces";
import {environment} from "../../../../environments/environment";

@Injectable({providedIn: "root"})

export class AuthService {

  public error$: Subject<string> = new Subject<string>()

  constructor(private http: HttpClient) {}

  get token(): string | null{
    // @ts-ignore
    const expDate = new Date(localStorage.getItem('fb-token-exp'))
    if(new Date() > expDate){
      return null
      this.logout()
    }
    // @ts-ignore
    return localStorage.getItem('fb-token')
  }

  login(user: User): Observable<any>{
    user.returnSecureToken = true

    // @ts-ignore
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        // @ts-ignore
        tap(this.setToken),
        // @ts-ignore
        catchError(this.handleError.bind(this))
      )
  }

  logout(){
    this.setToken(null)
  }

  isAuthenticated(): boolean{
    return !!this.token
  }

  private handleError(error: HttpErrorResponse){
    const {message} = error.error.error
    switch (message){
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Email not found')
        break
      case 'INVALID_EMAIL':
        this.error$.next('Invalid email')
        break
      case 'INVALID_PASSWORD':
        this.error$.next('Invalid password')
        break
    }
    return throwError(error)
  }

  private setToken(response: FbAuthResponse | null){
    if (response){
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000)
      localStorage.setItem('fb-token', response.idToken)
      localStorage.setItem('fb-token-exp', expDate.toString())
    } else {
      localStorage.clear()
    }

  }
}
