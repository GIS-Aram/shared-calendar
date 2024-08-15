import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, DateSelectArg } from '@fullcalendar/core';
import nlLocale from '@fullcalendar/core/locales/nl';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AppointmentService } from '../../services/appointment.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, MatButtonModule, MatIconModule],
  template: `
    <div class="calendar-container">
      <h2>Shared Calendar</h2>
      <full-calendar [options]="calendarOptions"></full-calendar>
    </div>
    <button mat-fab color="primary" class="add-appointment-button" (click)="addAppointment()">
      <mat-icon>add</mat-icon>
    </button>
  `,
  // styles: [`
  //   .calendar-container {
  //     padding: 20px;
  //     background-color: #ffffff;
  //     border-radius: 8px;
  //     box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  //   }
  //   h2 {
  //     margin-bottom: 20px;
  //     color: #333333;
  //   }
  //   .add-appointment-button {
  //     position: fixed;
  //     bottom: 30px;
  //     right: 30px;
  //   }
  // `]


  styles: [`
    .calendar-container {
      padding: 10px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    h2 {
      margin-bottom: 15px;
      color: #333333;
      font-size: 1.5rem;
      text-align: center;
      font-weight: bold;
    }
    .add-appointment-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000; /* Voeg deze regel toe om ervoor te zorgen dat de knop bovenop andere elementen blijft */
    }
    @media (max-width: 768px) {
      .calendar-container {
        padding: 5px;
      }
      h2 {
        font-size: 1.2rem;
        margin-bottom: 10px;
      }
      ::ng-deep .fc-toolbar {
        flex-direction: column;
        align-items: flex-start;
      }
      ::ng-deep .fc-toolbar-chunk {
        margin-bottom: 10px;
      }
      ::ng-deep .fc-view-harness {
        height: calc(100vh - 200px) !important;
      }
    }
  `]
  // zeker werkende stijlen
  // styles: [`
  // .calendar-container {
  //   padding: 20px;
  //   background-color: #ffffff;
  //   border-radius: 12px;
  //   box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  //   max-width: 100%;
  //   margin: 0 auto;
  // }
  // h2 {
  //   margin-bottom: 20px;
  //   color: #333333;
  //   text-align: center;
  //   font-weight: bold;
  //   font-size: 24px;
  // }
  // .fc-toolbar {
  //   margin-bottom: 20px;
  //   text-align: center;
  // }
  // @media (min-width: 576px) {
  //   .fc-toolbar {
  //     text-align: left;
  //   }
  // }
  // .fc-daygrid-event {
  //   background-color: #3f51b5;
  //   color: #ffffff;
  //   border-radius: 4px;
  //   padding: 2px 4px;
  //   border: none;
  //   font-size: 0.9em;
  //   text-align: center;
  // }
  // .fc-daygrid-day-top {
  //   text-align: center;
  //   color: #333333;
  //   font-weight: bold;
  // }
  // .add-appointment-button {
  //   position: fixed;
  //   bottom: 30px;
  //   right: 30px;
  //   background-color: #3f51b5;
  //   color: white;
  //   border-radius: 50%;
  //   box-shadow: 0px 3px 5px rgba(0,0,0,0.2);
  //   transition: background-color 0.3s;
  //   z-index: 1000;
  // }
  // .add-appointment-button:hover {
  //   background-color: #303f9f;
  // }
  // `]

})
export class CalendarComponent implements OnInit {
  calendarOptions_Werkend: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: [],
    eventClick: this.handleEventClick.bind(this),
    select: this.handleDateSelect.bind(this)
  };
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay', // ,dayGridWeek,dayGridDay
      // right: 'dayGridMonth,dayGridWeek,dayGridDay,timeGridWeek,timeGridDay'
    },
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: [],
    locale: nlLocale, // Stel de locale in voor Nederlandse 24-uurs tijdnotatie
    // Instellingen voor tijdslots
    slotDuration: '00:30:00', // Tijdsduur van elk slot (bijv. elk half uur)
    slotLabelInterval: '01:00:00', // Hoe vaak de tijdslabels moeten worden weergegeven (bijv. elk uur)
    slotMinTime: '07:00:00', // Starttijd van de agenda
    slotMaxTime: '24:00:00', // Eindtijd van de agenda
    // allDayContent: 'Events', // Tekst die wordt weergegeven voor de hele dag sectie
    scrollTime: '08:00:00', // Tijd waarop de agenda begint te scrollen:Scroll naar 8:00 AM bij het laden van de agenda

    eventClick: this.handleEventClick.bind(this),
    select: this.handleDateSelect.bind(this),
    height: 'auto',
    aspectRatio: 1.35,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false // Voorkomt AM/PM notatie, gebruikt 24-uurs formaat
    },
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      omitZeroMinute: false,
      meridiem: false // Gebruik 24-uurs formaat
    }
  };


  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadAppointments();
    this.adjustCalendarForMobile();
  }

  loadAppointments() {
    this.appointmentService.getAppointments().subscribe(
      (appointments) => {
        const events = appointments.map(appointment => ({
          id: appointment._id,
          title: appointment.title,
          start: new Date(appointment.startTime),
          end: new Date(appointment.endTime)
        }));
        this.calendarOptions.events = events;
      },
      (error) => {
        console.error('Error loading appointments', error);
        this.snackBar.open('Error loading appointments', 'Close', { duration: 3000 });
      }
    );
  }

  private adjustCalendarForMobile() {
    if (window.innerWidth <= 768) {
      this.calendarOptions.headerToolbar = {
        left: 'prev,next, today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      };
      this.calendarOptions.aspectRatio = 0.8;
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    const appointmentId = clickInfo.event.id;
    this.router.navigate(['/appointment/edit', appointmentId]);
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.router.navigate(['/appointment/new'], {
      queryParams: {
        start: selectInfo.startStr,
        end: selectInfo.endStr
      }
    });
  }

  addAppointment() {
    this.router.navigate(['/appointment/new']);
  }
}
