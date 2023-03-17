import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {FbAuthResponse, User} from "../../../shared/interfaces";
import {catchError, Observable, Subject, tap, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";

@Injectable({providedIn: "root"})
export class AuthService {
  public error$: Subject<string> = new Subject<string>()
  constructor(private http: HttpClient) {
  }

  get token(): string | null {
    const token = localStorage.getItem('fb-token-exp');
    if (!token) {
      return null;
    }
    const expDate = new Date(token)
    if (new Date() > expDate) {
      this.logout()
      return null;
    }
    return localStorage.getItem('fb-token')
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap((response: any) => this.setToken(response)),
        catchError(this.handleError.bind(this))
        //  tap(this.setToken)
      )
  }

  logout() {
    this.setToken(null)
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  private handleError(error: HttpErrorResponse) {
    const {message} = error.error.error

    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Невірний email.')
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Невірний пароль.')
        break;
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Такого email немає.')
        break;
      case 'EMAIL_EXISTS':
        this.error$.next('Адреса електронної пошти вже використовується іншим обліковим записом.')
        break;
      case 'OPERATION_NOT_ALLOWED':
        this.error$.next('Для цього проекту вхід за допомогою пароля вимкнено.')
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER : Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.':
        this.error$.next('Ми заблокували всі запити з цього пристрою через незвичну активність. Спробуйте ще раз пізніше.')
        break;
    }
    return throwError(error)
  }

  private setToken(response: FbAuthResponse | null) {
    if (response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000)
      localStorage.setItem('fb-token', response.idToken)
      localStorage.setItem('fb-token-exp', expDate.toString())
    } else {
      localStorage.clear()
    }
  }
}
