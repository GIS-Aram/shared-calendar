import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      tap(user => console.log('Received user data:', user)),
      catchError(error => {
        console.error('Error in getUserById:', error);
        return throwError('Error fetching user data');
      })
    );
  }
}
