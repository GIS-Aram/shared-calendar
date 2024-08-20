import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  // getAppointments(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/user/${this.getCurrentUserId()}`);
  // }
  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAppointmentById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // createAppointment(appointment: any): Observable<any> {
  //   const appointmentData = {
  //     ...appointment,
  //     userId: this.getCurrentUserId()
  //   };
  //   return this.http.post<any>(this.apiUrl, appointmentData);
  // }
  createAppointment(appointment: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // return this.http.post<any>(this.apiUrl, appointment, { headers });
    // console.log('Creating appointment with data:', appointment); // Debugging
    // return this.http.post<any>(this.apiUrl, appointment, { headers }).pipe(
    //   tap(response => console.log('Create appointment response:', response)) // Debugging
    // );
    return this.http.post<any>(this.apiUrl, appointment, { headers }).pipe(
      catchError(error => {
        if (error.status === 409) {
          return throwError('An overlapping appointment already exists.');
        }
        return throwError('An error occurred while creating the appointment.');
      })
    );
  }

  updateAppointment(id: string, appointment: any): Observable<any> {
    // return this.http.put<any>(`${this.apiUrl}/${id}`, appointment);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiUrl}/${id}`, appointment, { headers });
    // console.log('Updating appointment with data:', appointment); // Debugging
    // return this.http.put<any>(`${this.apiUrl}/${id}`, appointment, { headers }).pipe(
    //   tap(response => console.log('Update appointment response:', response)) // Debugging
    // );
  }

  deleteAppointment(id: string): Observable<any> {
    // return this.http.delete<any>(`${this.apiUrl}/${id}`);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }

  private getCurrentUserId(): string {
    // In een echte applicatie zou dit uit de authenticatieservice komen
    return 'currentUserId';
  }

  createAppointments(appointments: any[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/bulk`, appointments);
  }
}
