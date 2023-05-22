import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) { }

  registerUser(data: any): Observable<any> {
    return this.http.post('/api/data', data).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    if (error.status === 400 && error.error.message === 'User already exists!') {
      // You can call your MessageService here to send the message to your component
      // this.messageService.sendMessage(error.error.message);
    }
    return throwError(error);
  }
}
