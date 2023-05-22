import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isLogin = false;
  currentUser: string | null = null; // to store current user info

  constructor(private http: HttpClient) { }

  registerUser(data: any): Observable<any> {
    return this.http.post('/api/data', data).pipe(
      catchError(this.handleError)
    );
  }

  loginUser(data: any): Observable<any> {
    return this.http.post('/api/login', data).pipe(
      catchError(this.handleError)
    );
  }

  loginStatus(value: boolean, user: string | null) {
    this.isLogin = value;
    this.currentUser = user; // store the current logged-in user
  }

  private handleError(error: any) {
    if (error.status === 400 && error.error.message === 'User already exists!') {
      // You can call your MessageService here to send the message to your component
      // this.messageService.sendMessage(error.error.message);
    }
    return throwError(error);
  }
}
