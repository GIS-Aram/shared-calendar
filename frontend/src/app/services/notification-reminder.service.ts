import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationReminderService {
  constructor(private http: HttpClient) {}

  scheduleReminder(appointmentId: string, reminderTime: Date): Observable<any> {
    return this.http.post(`${environment.apiUrl}/reminders`, { appointmentId, reminderTime });
  }

  sendPushNotification(userId: string, message: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/notifications/push`, { userId, message });
  }

  sendEmailReminder(email: string, subject: string, body: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/notifications/email`, { email, subject, body });
  }
}
