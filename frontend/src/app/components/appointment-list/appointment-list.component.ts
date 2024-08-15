import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentService } from '../../services/appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog} from "@angular/material/dialog";
import {DeleteConfirmationDialogComponent} from "../delete-confirmation-dialog/delete-confirmation-dialog.component";
import {NotificationService} from "../../services/notificatie.service";

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <div class="appointment-list">
      <h2>Appointments</h2>
      <table mat-table [dataSource]="appointments" class="mat-elevation-z8">
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef> Title </th>
          <td mat-cell *matCellDef="let appointment"> {{appointment.title}} </td>
        </ng-container>

        <ng-container matColumnDef="startTime">
          <th mat-header-cell *matHeaderCellDef> Start Time </th>
          <td mat-cell *matCellDef="let appointment"> {{appointment.startTime | date:'short'}} </td>
        </ng-container>

        <ng-container matColumnDef="endTime">
          <th mat-header-cell *matHeaderCellDef> End Time </th>
          <td mat-cell *matCellDef="let appointment"> {{appointment.endTime | date:'short'}} </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let appointment">
            <button mat-icon-button color="primary" (click)="editAppointment(appointment._id)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteAppointment(appointment._id)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .appointment-list {
      padding: 0;
      margin: 0 auto;
    }
    @media (min-width: 768px) {
      .appointment-list {
        padding: 20px;
      }
    }
    table {
      width: 100%;
    }
  `]
})
export class AppointmentListComponent implements OnInit {
  appointments: any[] = [];
  displayedColumns: string[] = ['title', 'startTime', 'endTime', 'actions'];

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentService.getAppointments().subscribe(
      (appointments) => {
        this.appointments = appointments;
      },
      (error) => {
        console.error('Error loading appointments', error);
        this.snackBar.open('Error loading appointments', 'Close', { duration: 3000 });
      }
    );
  }

  editAppointment(id: string) {
    this.router.navigate(['/appointment/edit', id]);
  }

  deleteAppointmentOld(id: string) {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.deleteAppointment(id).subscribe(
        () => {
          this.snackBar.open('Appointment deleted successfully', 'Close', { duration: 3000 });
          this.loadAppointments();
        },
        (error) => {
          console.error('Error deleting appointment', error);
          this.snackBar.open('Error deleting appointment', 'Close', { duration: 3000 });
        }
      );
    }
  }

  deleteAppointment(id: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointmentService.deleteAppointment(id).subscribe(
          () => {
            this.snackBar.open('Afspraak succesvol verwijderd', 'Sluiten', { duration: 3000 });
            this.loadAppointments();
          },
          (error) => {
            console.error('Fout bij het verwijderen van de afspraak', error);
            this.snackBar.open('Fout bij het verwijderen van de afspraak', 'Sluiten', { duration: 3000 });
          }
        );
      }
    });
  }
}
