import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private httpClient: HttpClient) {}

  register(email: string, password: string): Observable<any> {
    return this.httpClient
      .post<any>('https://reqres.in/api/register', {
        email: email,
        password: password,
      })
      .pipe(
        tap((data) => console.log(data)),
        catchError((err) => this.handleError(err))
      );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = err.error.error || err.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
