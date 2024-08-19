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
import {MatIcon, MatIconModule} from "@angular/material/icon";
import { trigger, transition, style, animate } from '@angular/animations';
import {TaskService} from "../../services/task.service";
import {MatChip, MatChipListbox, MatChipsModule} from "@angular/material/chips";
import {AuthService} from "../../services/auth.service";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";

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
    MatSelectModule,
    MatIcon,
    MatIconModule,
    MatChip,
    MatChipsModule,
    MatChipListbox,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('600ms ease-out', style({ opacity: 0 }))
      ])
    ])
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
<!--          <mat-select [(ngModel)]="startTime" name="startTime" required #titleField="ngModel">-->
<!--            <mat-option *ngFor="let time of timeOptions" [value]="time">{{time}}</mat-option>-->
<!--          </mat-select>-->


          <input matInput [ngxTimepicker]="startPicker" [(ngModel)]="startTime" name="startTime" (ngModelChange)="onStartTimeChange()" [format]="24" readonly required>
          <mat-icon matSuffix (click)="startPicker.open()">access_time</mat-icon>
          <ngx-material-timepicker #startPicker></ngx-material-timepicker>
<!--          <input matInput type="time" [(ngModel)]="startTime" name="startTime" (ngModelChange)="onStartTimeChange()" required>-->
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
<!--          <mat-select [(ngModel)]="endTime" name="endTime" required #titleField="ngModel">-->
<!--            <mat-option *ngFor="let time of timeOptions" [value]="time">{{time}}</mat-option>-->
<!--          </mat-select>-->


          <input matInput [ngxTimepicker]="endPicker" [(ngModel)]="endTime" name="endTime" [format]="24" readonly required>
          <mat-icon matSuffix (click)="endPicker.open()">access_time</mat-icon>
          <ngx-material-timepicker #endPicker></ngx-material-timepicker>
<!--          <input matInput type="time" [(ngModel)]="endTime" name="endTime" required>-->
          <mat-error *ngIf="titleField.invalid && (titleField.dirty || titleField.touched)">
            Eindtijd is verplicht
          </mat-error>
        </mat-form-field>

<!--        <mat-form-field>-->
<!--          <mat-label>End Time</mat-label>-->
<!--          <input matInput type="time" [(ngModel)]="endTime" name="endTime" required>-->
<!--        </mat-form-field>-->

        <div class="reminders-section">
          <h3>Herinneringen</h3>
          <button mat-raised-button color="primary" type="button" (click)="addReminder()" class="mb-3">
            {{reminders && reminders.length ? 'Voeg nog een herinnering toe' : 'Herinnering toevoegen'}}
          </button>

          <div *ngIf="reminders.length === 0" class="no-reminders" @fadeInOut>
            Er zijn geen herinneringen ingesteld voor deze afspraak.
          </div>

          <div *ngFor="let reminder of reminders; let i = index" class="reminder-item">
            <mat-form-field>
              <mat-label>Herinneringstijd</mat-label>
              <mat-select [(ngModel)]="reminder.time" name="reminderTime{{i}}">
                <mat-option [value]="15">15 minuten</mat-option>
                <mat-option [value]="30">30 minuten</mat-option>
                <mat-option [value]="60">1 uur</mat-option>
                <mat-option [value]="1440">1 dag</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Type</mat-label>
              <mat-select [(ngModel)]="reminder.type" name="reminderType{{i}}">
                <mat-option value="email">E-mail</mat-option>
                <mat-option value="push">Push notificatie</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-icon-button color="warn" type="button" (click)="removeReminder(i)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>

<!--        <mat-form-field>-->
<!--          <mat-label>Taak toewijzen</mat-label>-->
<!--          <mat-select (selectionChange)="assignTask($event.value)">-->
<!--            <mat-option *ngFor="let task of tasks" [value]="task._id">-->
<!--              {{ task.title }}-->
<!--            </mat-option>-->
<!--          </mat-select>-->
<!--        </mat-form-field>-->

        <mat-form-field>
          <mat-label>Taken toewijzen</mat-label>
          <mat-select [(ngModel)]="appointment.taskIds" name="taskIds" (selectionChange)="assignTask($event.value)" multiple>
            <mat-option *ngFor="let task of availableTasks" [value]="task._id">
              {{ task.title }} {{ task.isAssigned ? '(Toegewezen)' : '' }}
            </mat-option>
          </mat-select>
        </mat-form-field>

<!--        <div *ngIf="appointment.taskIds && appointment.taskIds.length > 0" class="assigned-tasks">-->
<!--          <h3>Toegewezen taken:</h3>-->
<!--          <ul>-->
<!--            <li *ngFor="let taskId of appointment.taskIds">-->
<!--              {{ getTaskTitle(taskId) }}-->
<!--              <button mat-icon-button (click)="removeTask(taskId)" matTooltip="Verwijder taak">-->
<!--                <mat-icon>close</mat-icon>-->
<!--              </button>-->
<!--            </li>-->
<!--          </ul>-->
<!--        </div>-->
        <div *ngIf="appointment.taskIds && appointment.taskIds.length > 0" class="assigned-tasks">
          <h3>Toegewezen taken:</h3>
          <mat-chip-listbox>
            <mat-chip-option *ngFor="let taskId of appointment.taskIds" (removed)="removeTask(taskId)">
              {{ getTaskTitle(taskId) }}
              <button matChipRemove>
                <mat-icon>cancel</mat-icon>
              </button>
            </mat-chip-option>
          </mat-chip-listbox>
        </div>

        <button mat-raised-button color="primary" type="submit" [disabled]="!appointmentForm.form.valid || (isEditMode && !canEditAppointment(appointment))">
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

    /* herinneringsfunctionaliteit  */
    .reminders-section {
      margin-top: 20px;
      margin-bottom: 20px;
    }

    .reminder-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }

    .reminder-item mat-form-field {
      margin-right: 10px;
    }

    .no-reminders {
      background-color: #f9f9f9;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 10px;
      text-align: center;
      font-size: 14px;
      color: #666;
      margin-top: 20px;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }

    /* Toegewezen taken */
    .assigned-tasks {
      margin-top: 20px;
      margin-bottom: 20px;
    }

    .assigned-tasks h3 {
      margin-bottom: 10px;
    }

    mat-chip-list {
      display: flex;
      flex-wrap: wrap;
    }

    mat-chip {
      margin-right: 8px;
      margin-bottom: 8px;
    }

  `]
})
export class AppointmentFormComponent implements OnInit {
  appointment: any = {taskIds: [], userId: '', sharedWith: []};
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
  reminders: { time: number, type: string }[] = [];
  availableTasks: any[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService,
    private taskService: TaskService,
    private authService: AuthService
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
      } else {
        // Als er geen start en eindtijd is, stel dan de standaardwaarden in
        const now = new Date();
        this.startDate = now;
        this.startTime = '09:00';
        this.endDate = now;
        this.endTime = '10:00';
      }
    }

    this.loadAvailableTasks();
  }

  generateTimeOptions() {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute++) { // minute += 15
        this.timeOptions.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
  }

  loadAppointment(id: string) {
    this.appointmentService.getAppointmentById(id).subscribe(
      (appointment) => {
        this.appointment = appointment;

        if (!this.appointment.taskIds) {
          this.appointment.taskIds = [];
        }

        this.setDateTimeFields(new Date(appointment.startTime), new Date(appointment.endTime), false);
        this.reminders = appointment.reminders || []; // Laad bestaande herinneringen
        this.loadAvailableTasks();
        console.log('Loaded appointment:', this.appointment); // Voor debugging
      },
      (error) => {
        console.error('Error loading appointment', error);
        this.snackBar.open('Error loading appointment', 'Close', { duration: 3000 });
      }
    );
  }

  setDateTimeFields(start: Date, end: Date, isNewAppointment: boolean = true) {
    if (isNewAppointment) {
      // Stel de starttijd in op 09:00
      start.setHours(9);
      start.setMinutes(0);

      // Stel de eindtijd in op een uur later
      end.setHours(9);
      end.setMinutes(0);
    }

    this.startDate = start;
    this.startTime = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`;
    // this.endDate = end;
    // this.endTime = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;

    // Zorg ervoor dat End Date hetzelfde is als Start Date.
    this.endDate = start; // Gebruik de start datum in plaats van end datum
    this.endTime = `${(start.getHours() + 1).toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`; // Voeg een uur toe voor de eindtijd.
  }

  formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }

  onStartTimeChange() {
    // Parse de starttijd die door de gebruiker is geselecteerd
    const [hours, minutes] = this.startTime.split(':').map(Number);

    // Stel de eindtijd in op één uur na de starttijd
    const end = new Date();
    end.setHours(hours + 1, minutes);

    // Stel de eindtijd in het juiste formaat in
    this.endTime = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
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


      this.appointment.reminders = this.reminders;
      this.appointment.taskIds = this.appointment.taskIds || [];
      console.log('Submitting appointment with tasks:', this.appointment.taskIds); // Voor debugging


      if (this.isEditMode) {
        this.appointmentService.updateAppointment(this.appointment._id, this.appointment).subscribe(
          () => {
            this.snackBar.open('Appointment updated successfully', 'Close', { duration: 3000 });
            this.notificationService.showSuccess('Afspraak succesvol bijgewerkt', 'Afspraak Bijwerken');
            this.router.navigate(['/calendar']);
          },
          (error) => {
            console.error('Error creating appointment', error);
            if (error === 'An overlapping appointment already exists.') {
              // this.snackBar.open('Er bestaat al een afspraak op dit tijdstip. Kies alstublieft een ander tijdstip.', 'Sluiten', { duration: 5000 });
              this.notificationService.showError('Er bestaat al een afspraak op dit tijdstip. Kies alstublieft een ander tijdstip.', 'Foutmelding Aanmaken Afspraak');
            } else {
              this.snackBar.open('Error creating appointment', 'Close', { duration: 3000 });
            }
            // this.notificationService.showError('Fout bij het aanmaken van de afspraak', 'Foutmelding Aanmaken Afspraak');
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
            this.notificationService.showError('Er bestaat al een afspraak op dit tijdstip. Kies alstublieft een ander tijdstip.', 'Foutmelding Aanmaken Afspraak');
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
    // this.router.navigate(['/calendar']);
    window.history.back();
  }

  addReminder() {
    this.reminders.push({ time: 15, type: 'email' });
  }
  removeReminder(index: number) {
    this.reminders.splice(index, 1);
  }

  loadAvailableTasks() {
    this.taskService.getTasks().subscribe(
      tasks => {
        this.availableTasks = tasks
        console.log('Available tasks:', this.availableTasks); // Voor debugging

        // Filter out tasks that are already assigned to this appointment
        if (this.isEditMode && this.appointment.taskIds) {
          // this.availableTasks = this.availableTasks.filter(task => !this.appointment.taskIds.includes(task._id));
          // Mark tasks that are already assigned to this appointment
          this.availableTasks.forEach(task => {
            task.isAssigned = this.appointment.taskIds.includes(task._id);
          });
        }
        console.log('Available tasks after assignment check:', this.availableTasks); // Voor debugging

      },
      error => console.error('Error loading tasks', error)
    );
  }

  assignTask_Old(taskId: string) {
    const task = this.availableTasks.find(t => t._id === taskId);
    if (task) {
      task.appointmentId = this.appointment._id;
      this.taskService.updateTask(task._id, task).subscribe(
        () => this.loadAvailableTasks(),
        error => console.error('Error assigning task', error)
      );
    }
  }

  assignTask(taskIds: string[]): void {
    this.appointment.taskIds = taskIds;
    console.log('Assigned tasks:', this.appointment.taskIds); // Voor debugging
  }

  getTaskTitle(taskId: string): string {
    const task = this.availableTasks.find(t => t._id === taskId);
    return task ? task.title : 'Onbekende taak';
  }

  removeTask(taskId: string): void {
    this.appointment.taskIds = this.appointment.taskIds.filter((id: any) => id !== taskId);
  }

  canEditAppointment(appointment: any): boolean {
    const currentUserId = this.authService.getCurrentUserId();
    const partnerUserId = this.authService.getPartnerUserId();

    console.log('Current User ID:', currentUserId);
    console.log('Partner User ID:', partnerUserId);
    console.log('Appointment:', appointment);

    const canEdit = appointment.userId === currentUserId ||
      (appointment.sharedWith && appointment.sharedWith.includes(currentUserId)) ||
      appointment.userId === partnerUserId ||
      (appointment.sharedWith && appointment.sharedWith.includes(partnerUserId));

    console.log('Can Edit:', canEdit);
    return canEdit;
  }
}
