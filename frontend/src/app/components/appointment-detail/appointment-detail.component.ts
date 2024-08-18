import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AppointmentService } from '../../services/appointment.service';
import {DeleteConfirmationDialogComponent} from "../delete-confirmation-dialog/delete-confirmation-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatDividerModule],
  template: `
    <div class="container">
      <button mat-icon-button color="primary" class="back-button" (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <mat-card *ngIf="appointment" class="appointment-card">
        <mat-card-header>
          <mat-card-title>{{appointment.title}}</mat-card-title>
          <mat-card-subtitle>{{appointment.startTime | date:'fullDate'}}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="info-row">
            <mat-icon>schedule</mat-icon>
            <span>{{appointment.startTime | date:'shortTime'}} - {{appointment.endTime | date:'shortTime'}}</span>
          </div>
          <div class="info-row" *ngIf="appointment.location">
            <mat-icon>place</mat-icon>
            <span>{{appointment.location}}</span>
          </div>
          <mat-divider class="my-3"></mat-divider>
          <p class="description">{{appointment.description}}</p>
          <mat-divider class="my-3"></mat-divider>
          <div class="info-row" *ngIf="creatorName">
            <mat-icon>person</mat-icon>
            <span>Created by: {{creatorName}}</span>
          </div>
          <div class="info-row" *ngIf="appointment.attendees && appointment.attendees.length">
            <mat-icon>group</mat-icon>
            <span>Attendees: {{appointment.attendees.join(', ')}}</span>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button color="primary" (click)="editAppointment(appointment._id)">EDIT</button>
          <button mat-button color="warn" (click)="deleteAppointment(appointment._id)">DELETE</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  // styles: [`
  //   .container {
  //     max-width: 600px;
  //     margin: 20px auto;
  //     position: relative;
  //   }
  //   .appointment-card {
  //     max-width: 600px;
  //     margin: 20px auto;
  //     padding: 20px;
  //   }
  //   .info-row {
  //     display: flex;
  //     align-items: center;
  //     margin-bottom: 10px;
  //   }
  //   .info-row mat-icon {
  //     margin-right: 10px;
  //     color: #555;
  //   }
  //   .description {
  //     white-space: pre-wrap;
  //     margin: 15px 0;
  //   }
  //   .my-3 {
  //     margin: 15px 0;
  //   }
  //   .back-button {
  //     position: absolute;
  //     top: -40px;
  //     left: 0;
  //   }
  // `]
  styles: [`
    .container {
      max-width: 700px;
      margin: 60px auto;
      position: relative;
      padding: 15px;
      background-color: #f5f5f5;
    }

    .appointment-card {
      background: #ffffff;
      border-radius: 15px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border: 1px solid #e0e0e0;
      margin-top: 20px;
      padding-top: 20px;
    }
    .appointment-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    }

    .info-row {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      font-size: 14px;
      color: #555;
    }

    .info-row mat-icon {
      margin-right: 10px;
      color: #00796b;
    }

    .description {
      white-space: pre-wrap;
      margin: 15px 0;
      font-size: 16px;
      line-height: 1.5;
      color: #333;
    }

    .my-3 {
      margin: 15px 0;
    }

    .back-button {
      position: absolute;
      top: -40px;
      left: 0;
      background-color: #00796b;
      color: white;
    }

    mat-card-title {
      font-size: 26px;
      font-weight: bold;
      color: #00695c;
    }

    mat-card-subtitle {
      font-size: 16px;
      color: #757575;
    }

    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      padding: 16px;
    }

    mat-card-actions button {
      margin-left: 10px;
      font-size: 14px;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }

    mat-card-actions button:hover {
      transform: scale(1.1);
      background-color: #004d40;
      color: white;
    }
    .back-button {
      position: absolute;
      top: -60px;
      left: 0;
      margin-bottom: 20px;
      background-color: #004d40;
      color: white;
      border-radius: 50%;
      height: 50px;
      width: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
      transition: background-color 0.3s ease;
    }

    .back-button:hover {
      background-color: #002f2c;
    }

  `]
})
export class AppointmentDetailComponent implements OnInit {
  appointment: any;
  creatorName: string = '';

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private userService: UserService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAppointment(id);
    }
  }

  loadAppointment(id: string) {
    this.appointmentService.getAppointmentById(id).subscribe(
      data => {
        console.log('Received appointment data:', JSON.stringify(data, null, 2));

        this.appointment = data;
        this.loadCreatorName();
      },
      error => {
        console.error('Error fetching appointment details', error);
      }
    );
  }

  loadCreatorName() {
    console.log('Starting loadCreatorName');
    if (this.appointment) {
      console.log('Appointment object:', this.appointment);
      const userId = this.appointment.userId;

      if (userId) {
        console.log('User ID found:', userId);
        this.userService.getUserById(userId).subscribe(
          user => {
            console.log('Received user data:', user);
            this.creatorName = user.name || user.email || 'Unknown';
            console.log('Set creatorName to:', this.creatorName);
          },
          error => {
            console.error('Error fetching creator details', error);
            this.creatorName = 'Unknown (Error fetching details)';
          }
        );
      } else {
        console.log('No user ID found, setting creatorName to Unknown');
        this.creatorName = 'Unknown (No ID found)';
      }
    } else {
      console.log('No appointment object found');
      this.creatorName = 'Unknown (No appointment data)';
    }
  }

  editAppointment(id: string) {
    // Implementeer navigatie naar het bewerkingsformulier
    this.router.navigate(['/appointment/edit', id]);
  }

  deleteAppointment(id: string) {
    // Implementeer verwijderlogica met bevestigingsdialoog
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointmentService.deleteAppointment(id).subscribe(
          () => {
            this.snackBar.open('Afspraak succesvol verwijderd', 'Sluiten', { duration: 3000 });
            // this.loadAppointments();
          },
          (error) => {
            console.error('Fout bij het verwijderen van de afspraak', error);
            this.snackBar.open('Fout bij het verwijderen van de afspraak', 'Sluiten', { duration: 3000 });
          }
        );
      }
    });
  }

  goBack() {
    this.router.navigate(['/appointments']);
  }
}
