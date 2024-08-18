import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {Router} from "@angular/router";
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient,
              private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
    this.checkTokenExpiration();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  register(user: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/register`, user);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/users/login`, { email, password })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }
  // login(email: string, password: string): Observable<any> {
  //   return this.http.post<any>(`${environment.apiUrl}/users/login`, { email, password })
  //     .pipe(map(response => {
  //       const user = JSON.parse(JSON.stringify(response.result));
  //       user.email = email; // Voeg het email expliciet toe
  //       localStorage.setItem('currentUser', JSON.stringify(user));
  //       this.currentUserSubject.next(user);
  //       return user;
  //     }));
  // }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue && !!this.currentUserValue.token;
  }

  invitePartner(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/invite-partner`, { partnerEmail: email });
  }

  private checkTokenExpiration() {
    if (this.currentUserValue && this.currentUserValue.token) {
      const token = this.currentUserValue.token;
      const decodedToken: any = jwtDecode(token);
      const expirationDate = new Date(decodedToken.exp * 1000);

      if (expirationDate <= new Date()) {
        this.logout();
      } else {
        // Set a timeout to logout when the token expires
        const timeUntilExpiration = expirationDate.getTime() - new Date().getTime();
        setTimeout(() => this.logout(), timeUntilExpiration);
      }
    }
  }

}
