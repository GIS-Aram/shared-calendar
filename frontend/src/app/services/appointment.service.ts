import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.post<any>(this.apiUrl, appointment, { headers });
  }

  updateAppointment(id: string, appointment: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, appointment);
  }

  deleteAppointment(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  private getCurrentUserId(): string {
    // In een echte applicatie zou dit uit de authenticatieservice komen
    return 'currentUserId';
  }
}
