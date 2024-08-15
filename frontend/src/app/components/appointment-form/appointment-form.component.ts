import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AppointmentService } from '../../services/appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSelectModule} from "@angular/material/select";
import {NotificationService} from "../../services/notificatie.service";
import {ToastrService} from "ngx-toastr";
import {provideAnimations} from "@angular/platform-browser/animations";

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  template: `
    <div class="appointment-form">
      <h2>{{isEditMode ? 'Edit' : 'Create'}} Appointment</h2>
      <form #appointmentForm="ngForm" (ngSubmit)="onSubmit(appointmentForm)">

      <mat-form-field>
          <mat-label>Title</mat-label>
          <input matInput [(ngModel)]="appointment.title" name="title" required #titleField="ngModel">
          <mat-error *ngIf="titleField.invalid && (titleField.dirty || titleField.touched)">
            Titel is verplicht
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Description</mat-label>
          <textarea matInput [(ngModel)]="appointment.description" name="description" #titleField="ngModel"></textarea>
          <mat-error *ngIf="titleField.invalid && (titleField.dirty || titleField.touched)">
            Beschrijving is optioneel
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Start Date</mat-label>
          <input matInput [matDatepicker]="startDatePicker" [(ngModel)]="startDate" name="startDate" required #titleField="ngModel">
          <mat-datepicker-toggle matSuffix [for]="startDatePicker"></mat-datepicker-toggle>
          <mat-datepicker #startDatePicker></mat-datepicker>
          <mat-error *ngIf="titleField.invalid && (titleField.dirty || titleField.touched)">
            Startdatum is verplicht
          </mat-error>
        </mat-form-field>

<!--        <mat-form-field>-->
<!--          <mat-label>Start Time</mat-label>-->
<!--          <input matInput type="time" [(ngModel)]="startTime" name="startTime" required>-->
<!--        </mat-form-field>-->

<!--        <mat-form-field>-->
<!--          <mat-label>Start Tijd</mat-label>-->
<!--          <mat-select [(ngModel)]="startHour" name="startHour" required>-->
<!--            <mat-option *ngFor="let hour of hours" [value]="hour">{{hour}}:00</mat-option>-->
<!--          </mat-select>-->
<!--        </mat-form-field>-->

<!--        <mat-form-field>-->
<!--          <mat-label>Start Minuut</mat-label>-->
<!--          <mat-select [(ngModel)]="startMinute" name="startMinute" required>-->
<!--            <mat-option *ngFor="let minute of minutes" [value]="minute">{{minute}}</mat-option>-->
<!--          </mat-select>-->
<!--        </mat-form-field>-->
        <mat-form-field>
          <mat-label>Start Tijd</mat-label>
          <mat-select [(ngModel)]="startTime" name="startTime" required #titleField="ngModel">
            <mat-option *ngFor="let time of timeOptions" [value]="time">{{time}}</mat-option>
          </mat-select>
          <mat-error *ngIf="titleField.invalid && (titleField.dirty || titleField.touched)">
            Starttijd is verplicht
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>End Date</mat-label>
          <input matInput [matDatepicker]="endDatePicker" [(ngModel)]="endDate" name="endDate" required #titleField="ngModel">
          <mat-datepicker-toggle matSuffix [for]="endDatePicker"></mat-datepicker-toggle>
          <mat-datepicker #endDatePicker></mat-datepicker>
          <mat-error *ngIf="titleField.invalid && (titleField.dirty || titleField.touched)">
            Einddatum is verplicht
          </mat-error>
        </mat-form-field>

<!--        <mat-form-field>-->
<!--          <mat-label>Eind Tijd</mat-label>-->
<!--          <mat-select [(ngModel)]="endHour" name="endHour" required>-->
<!--            <mat-option *ngFor="let hour of hours" [value]="hour">{{hour}}:00</mat-option>-->
<!--          </mat-select>-->
<!--        </mat-form-field>-->

<!--        <mat-form-field>-->
<!--          <mat-label>Eind Minuut</mat-label>-->
<!--          <mat-select [(ngModel)]="endMinute" name="endMinute" required>-->
<!--            <mat-option *ngFor="let minute of minutes" [value]="minute">{{minute}}</mat-option>-->
<!--          </mat-select>-->
<!--        </mat-form-field>-->
        <mat-form-field>
          <mat-label>Eind Tijd</mat-label>
          <mat-select [(ngModel)]="endTime" name="endTime" required #titleField="ngModel">
            <mat-option *ngFor="let time of timeOptions" [value]="time">{{time}}</mat-option>
          </mat-select>
          <mat-error *ngIf="titleField.invalid && (titleField.dirty || titleField.touched)">
            Eindtijd is verplicht
          </mat-error>
        </mat-form-field>

<!--        <mat-form-field>-->
<!--          <mat-label>End Time</mat-label>-->
<!--          <input matInput type="time" [(ngModel)]="endTime" name="endTime" required>-->
<!--        </mat-form-field>-->

        <button mat-raised-button color="primary" type="submit" [disabled]="!appointmentForm.form.valid">
          {{isEditMode ? 'Update' : 'Create'}}
        </button>
        <button mat-button type="button" (click)="goBack()">Annuleren</button>
      </form>
    </div>
  `,
  styles: [`
    .appointment-form {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 20px;
      display: block;
    }
  `]
})
export class AppointmentFormComponent implements OnInit {
  appointment: any = {};
  isEditMode = false;
  startDate: Date | null = null;
  // startTime: string = '';
  endDate: Date | null = null;
  // endTime: string = '';
  hours: string[] = Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0'));
  minutes: string[] = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));
  startHour: string = '00';
  startMinute: string = '00';
  endHour: string = '00';
  endMinute: string = '00';
  timeOptions: string[] = [];
  startTime: string = '00:00';
  endTime: string = '00:00';

  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.generateTimeOptions();


    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadAppointment(id);
    } else {
      const startStr = this.route.snapshot.queryParamMap.get('start');
      const endStr = this.route.snapshot.queryParamMap.get('end');
      if (startStr && endStr) {
        this.setDateTimeFields(new Date(startStr), new Date(endStr));
      }
    }
  }

  generateTimeOptions() {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        this.timeOptions.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
  }

  loadAppointment(id: string) {
    this.appointmentService.getAppointmentById(id).subscribe(
      (appointment) => {
        this.appointment = appointment;
        this.setDateTimeFields(new Date(appointment.startTime), new Date(appointment.endTime));
      },
      (error) => {
        console.error('Error loading appointment', error);
        this.snackBar.open('Error loading appointment', 'Close', { duration: 3000 });
      }
    );
  }

  setDateTimeFields(start: Date, end: Date) {
    this.startDate = start;
    this.startTime = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`;
    this.endDate = end;
    this.endTime = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
  }

  formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }

  onSubmit(form: NgForm) {
    // if (!this.startDate || !this.endDate) {
    //   this.snackBar.open('Please select both start and end dates', 'Close', { duration: 3000 });
    //   return;
    // }
    //
    // this.appointment.startTime = this.combineDateAndTime(this.startDate, this.startTime);
    // this.appointment.endTime = this.combineDateAndTime(this.endDate, this.endTime);

    if (form.valid) {
      // Bestaande submit logica
      if (!this.startDate || !this.endDate) {
        this.snackBar.open('Selecteer alstublieft zowel start- als einddatum', 'Sluiten', { duration: 3000 });
        return;
      }

      // this.appointment.startTime = this.combineDateAndTime(this.startDate, `${this.startHour}:${this.startMinute}`);
      // this.appointment.endTime = this.combineDateAndTime(this.endDate, `${this.endHour}:${this.endMinute}`);
      this.appointment.startTime = this.combineDateAndTime(this.startDate, this.startTime);
      this.appointment.endTime = this.combineDateAndTime(this.endDate, this.endTime);

      if (this.isEditMode) {
        this.appointmentService.updateAppointment(this.appointment._id, this.appointment).subscribe(
          () => {
            this.snackBar.open('Appointment updated successfully', 'Close', { duration: 3000 });
            this.notificationService.showSuccess('Afspraak succesvol bijgewerkt', 'Afspraak Bijwerken');
            this.router.navigate(['/calendar']);
          },
          (error) => {
            console.error('Error updating appointment', error);
            this.snackBar.open('Error updating appointment', 'Close', { duration: 3000 });
          }
        );
      } else {
        this.appointmentService.createAppointment(this.appointment).subscribe(
          () => {
            this.snackBar.open('Appointment created successfully', 'Close', { duration: 3000 });
            this.notificationService.showSuccess('Afspraak succesvol aangemaakt', 'Afspraak Aanmaken');
            this.router.navigate(['/calendar']);
          },
          (error) => {
            console.error('Error creating appointment', error);
            this.snackBar.open('Error creating appointment', 'Close', { duration: 3000 });
            this.notificationService.showError('Fout bij het aanmaken van de afspraak', 'Foutmelding Aanmaken Afspraak');
          }
        );
      }
    } else {
      this.snackBar.open('Vul alstublieft alle verplichte velden in', 'Sluiten', { duration: 3000 });
      this.notificationService.showInfo('Vul alstublieft alle verplichte velden in', 'Velden Invullen');
    }

  }

  combineDateAndTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes);
    return combined;
  }

  goBack() {
    this.router.navigate(['/calendar']);
  }
}
