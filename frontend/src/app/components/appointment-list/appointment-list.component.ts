import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentService } from '../../services/appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog} from "@angular/material/dialog";
import {DeleteConfirmationDialogComponent} from "../delete-confirmation-dialog/delete-confirmation-dialog.component";
import {NotificationService} from "../../services/notificatie.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {animate, style, transition, trigger} from "@angular/animations";
import {MatExpansionModule, MatExpansionPanel, MatExpansionPanelTitle} from "@angular/material/expansion";

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule, MatDatepickerInput, MatDatepickerToggle, MatDatepicker, MatSortModule, MatExpansionPanel, MatExpansionPanelTitle,
    MatExpansionModule
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ],
  template: `
    <div class="appointment-list">
      <h1 class="page-title">Appointments</h1>
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>
            Filters
          </mat-panel-title>
        </mat-expansion-panel-header>
        <div class="search-filters filter-container">
          <mat-form-field appearance="fill">
            <mat-label>Search by title</mat-label>
            <input matInput [(ngModel)]="searchKeyword" placeholder="Enter a keyword" (keyup)="applyFilters()" />
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Filter by date</mat-label>
  <!--          <input matInput [(ngModel)]="selectedDate" placeholder="Choose a date" (change)="applyFilters()" type="date" />-->
            <input matInput [matDatepicker]="picker" [(ngModel)]="selectedDate" placeholder="Choose a date" (dateChange)="applyFilters()" />
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
  <!--        <mat-form-field appearance="fill">-->
  <!--          <mat-label>Filter by user</mat-label>-->
  <!--          <mat-select [(ngModel)]="selectedUser" (selectionChange)="applyFilters()">-->
  <!--            <mat-option *ngFor="let user of users" [value]="user">{{user}}</mat-option>-->
  <!--          </mat-select>-->
  <!--        </mat-form-field>-->
          <mat-form-field appearance="fill">
            <mat-label>Filter by status</mat-label>
            <mat-select [(ngModel)]="selectedStatus" (selectionChange)="applyFilters()">
              <mat-option value="all">Alle afspraken</mat-option>
              <mat-option value="past">Verlopen afspraken</mat-option>
              <mat-option value="upcoming">Komende afspraken</mat-option>
            </mat-select>
          </mat-form-field>

<!--          <mat-form-field>-->
<!--            <input matInput [matDatepicker]="picker1" placeholder="Startdatum" [(ngModel)]="startDate">-->
<!--            <mat-datepicker-toggle matSuffix [for]="picker1"></mat-datepicker-toggle>-->
<!--            <mat-datepicker #picker1></mat-datepicker>-->
<!--          </mat-form-field>-->

<!--          <mat-form-field>-->
<!--            <input matInput [matDatepicker]="picker2" placeholder="Einddatum" [(ngModel)]="endDate">-->
<!--            <mat-datepicker-toggle matSuffix [for]="picker2"></mat-datepicker-toggle>-->
<!--            <mat-datepicker #picker2></mat-datepicker>-->
<!--          </mat-form-field>-->

<!--            <button mat-raised-button color="primary" (click)="filterByDateRange()">Filter</button>-->

        <!-- Reset Button -->
          <button mat-raised-button class="reset-filters-btn" color="primary" (click)="resetFilters()">Reset Filters</button>
        </div>
      </mat-expansion-panel>

<!--      <div *ngIf="filteredAppointments.length === 0;" class="no-results" @fadeIn> &lt;!&ndash; else appointmentTable &ndash;&gt;-->
<!--        <p>Er zijn geen afspraken gevonden die overeenkomen met de geselecteerde filters.</p>-->
<!--      </div>-->

<!--      <ng-template #appointmentTable>-->
      <table *ngIf="filteredAppointments" mat-table [dataSource]="dataSource" matSort class="mat-elevation-z8 custom-table mt-3">
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Title </th>
          <td mat-cell *matCellDef="let appointment"> {{appointment.title}} </td>
        </ng-container>

        <ng-container matColumnDef="startTime">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Start Time </th>
          <td mat-cell *matCellDef="let appointment"> {{appointment.startTime | date:'short'}} </td>
        </ng-container>

        <ng-container matColumnDef="endTime">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> End Time </th>
          <td mat-cell *matCellDef="let appointment"> {{appointment.endTime | date:'short'}} </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let appointment">
            <button mat-icon-button color="primary" (click)="viewAppointment(appointment._id)">
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button color="primary" (click)="editAppointment(appointment._id)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteAppointment(appointment._id)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" @fadeIn></tr>
      </table>
<!--      </ng-template>-->
      <div *ngIf="filteredAppointments.length === 0;" class="no-results" @fadeIn> <!-- else appointmentTable -->
        <p>Er zijn geen afspraken gevonden die overeenkomen met de geselecteerde filters.</p>
      </div>
    </div>
  `,
  styles: [`
    .appointment-list {
      padding: 0;
      margin: 0 auto;
    }
    //.search-filters {
    //  display: flex;
    //  gap: 10px;
    //  margin-bottom: 20px;
    //}
    @media (min-width: 768px) {
      .appointment-list {
        padding: 20px;
      }
    }
    table {
      width: 100%;
    }
    .reset-filters-btn {
      height: 56px; /* Dezelfde hoogte als mat-form-field */
      line-height: 56px; /* Zorgt ervoor dat de tekst gecentreerd is */
    }
    .filter-container {
      display: flex;
      flex-wrap: wrap;
      gap: 16px; /* Ruimte tussen elementen */
    }

    .filter-container mat-form-field,
    .filter-container .reset-filters-btn {
      flex: 1 1 calc(50% - 16px); /* Neem 50% van de breedte, minus de gap */
      min-width: 200px; /* Minimaal 200px breed */
    }

    @media (min-width: 600px) {
      .filter-container mat-form-field,
      .filter-container .reset-filters-btn {
        //flex: 1 1 100%; /* Neem de volledige breedte op kleine schermen */
        flex: 1 1 calc(25% - 16px); /* Neem 25% van de breedte, minus de gap, op grote schermen */
      }
    }

    /* Custom styles for Mat-table */
    .custom-table {
      width: 100%;
      border-spacing: 0 8px;
    }

    .custom-table th {
      background-color: #4a90e2;
      color: white;
      text-transform: uppercase;
      font-weight: bold;
      padding: 12px;
    }

    .custom-table td {
      padding: 12px;
    }

    .custom-table tr:hover {
      background-color: #e0f7fa;
    }

    .custom-table tr:nth-child(odd) {
      background-color: #f7f7f7;
    }

    .custom-table tr:nth-child(even) {
      background-color: #ffffff;
    }

    .custom-table mat-icon {
      vertical-align: middle;
      margin-left: 8px;
    }
    ::ng-deep .mat-sort-header-arrow, ::ng-deep .mat-sort-header-button {
      color: white !important;
      font-weight: bold !important;
    }

    /* Bericht */
    .no-results {
      text-align: center;
      padding: 50px;
      font-size: 1.2rem;
      color: #757575; /* Kies een kleur die bij je thema past */
    }

    /* Heaeder van deze pagina */
    .page-title {
      font-size: 24px; /* Verhoog dit voor een grotere tekst */
      color: #3f51b5; /* Of gebruik een kleur die bij je stijl past */
      margin-bottom: 16px; /* Ruimte onder de titel */
      text-align: center; /* Of gebruik left of right afhankelijk van je behoefte */
    }

    /* Angular Material Expansion Panel for snall screen */
    @media (max-width: 600px) {
      .filter-container {
        flex-direction: column;
      }
    }



  `]
})
export class AppointmentListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  displayedColumns: string[] = ['title', 'startTime', 'endTime', 'actions'];

  searchKeyword: string = '';
  selectedDate: string = '';
  selectedUser: string = '';
  selectedStatus: string = 'all'; // Default status filter
  users: string[] = ['User1', 'User2', 'User3']; // Example user list
  startDate: Date | null = null;
  endDate: Date | null = null;
  dataSource = new MatTableDataSource<any>(this.filteredAppointments);

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadAppointments() {
    this.appointmentService.getAppointments().subscribe(
      (appointments) => {
        this.appointments = appointments;
        this.filteredAppointments = [...appointments]; // Initialize filtered list
        this.dataSource.data = this.filteredAppointments;
        this.dataSource.sort = this.sort; // Ensure sort is applied to the loaded data
        this.applyFilters(); // Pas filters toe op de geladen afspraken
      },
      (error) => {
        console.error('Error loading appointments', error);
        this.snackBar.open('Error loading appointments', 'Close', { duration: 3000 });
      }
    );
  }

  applyFilters_Werkend() {
    this.filteredAppointments = this.appointments.filter(appointment => {
      const matchesKeyword = appointment.title.toLowerCase().includes(this.searchKeyword.toLowerCase());
      const matchesDate = this.selectedDate ? this.compareDatesWithoutTime(new Date(appointment.startTime), this.selectedDate as unknown as Date) : true;
      // const matchesUser = this.selectedUser ? appointment.users.includes(this.selectedUser) : true;
      const matchesStatus = this.filterByStatus(appointment); // Gebruik de filterByStatus-methode
      this.dataSource.data = this.filteredAppointments;
      return matchesKeyword && matchesDate && matchesStatus;
    });
  }

  applyFilters() {
    this.filteredAppointments = this.appointments.filter(appointment => {
      const matchesKeyword = this.searchKeyword ? appointment.title.toLowerCase().includes(this.searchKeyword.toLowerCase()) : true;

      // Controleer of selectedDate correct wordt vergeleken
      const matchesDate = this.selectedDate ? this.compareDatesWithoutTime(new Date(appointment.startTime), new Date(this.selectedDate)) : true;

      console.log('Selected Date:', this.selectedDate); // Controleer of de geselecteerde datum correct is
      console.log('Appointment Date:', appointment.startTime); // Controleer de datum van de afspraak

      const matchesStatus = this.filterByStatus(appointment); // Gebruik de filterByStatus-methode

      return matchesKeyword && matchesDate && matchesStatus;
    });

    // Werk de dataSource bij met de gefilterde data
    this.dataSource.data = this.filteredAppointments;
  }


  compareDatesWithoutTime(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  filterByDateRange(): void {
    console.log('Filtering by date range', this.startDate, this.endDate)
    if (this.startDate && this.endDate) {
      this.filteredAppointments = this.appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= this.startDate! && appointmentDate <= this.endDate!;
      });
    } else {
      this.filteredAppointments = [...this.appointments];
    }
  }

  filterByStatus(appointment: any): boolean {
    // const now = new Date();
    // if (this.selectedStatus === 'past') {
    //   return new Date(appointment.endTime) < now;
    // } else if (this.selectedStatus === 'upcoming') {
    //   return new Date(appointment.startTime) > now;
    // } else {
    //   return true; // For 'all' status
    // }
    const now = new Date();
    const startTime = new Date(appointment.startTime);
    const endTime = new Date(appointment.endTime);

    console.log('Filter Status:', this.selectedStatus); // Debug de geselecteerde status
    console.log('Start Time:', startTime); // Debug de starttijd van de afspraak
    console.log('End Time:', endTime); // Debug de eindtijd van de afspraak
    console.log('Now:', now); // Debug de huidige tijd

    if (this.selectedStatus === 'past') {
      return endTime < now;
    } else if (this.selectedStatus === 'upcoming') {
      return startTime > now;
    } else {
      return true; // For 'all' status
    }
  }

  resetFilters() {
    this.selectedDate = '';
    this.searchKeyword = '';
    this.selectedStatus = 'all';
    // Reset de gefilterde afspraken naar de volledige lijst
    this.filteredAppointments = [...this.appointments];

    // Pas opnieuw de filters toe (in dit geval geen filters)
    this.applyFilters();
  }

  viewAppointment(id: string) {
    this.router.navigate(['/appointment', id]);
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

  protected readonly MatSort = MatSort;
}
