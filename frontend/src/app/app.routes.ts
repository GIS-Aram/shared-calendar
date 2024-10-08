import { Routes } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import {RegisterComponent} from "./components/register/register.component";
import {LoginComponent} from "./components/login/login.component";
import {PartnerInviteComponent} from "./components/partner-invite/partner-invite.component";
import {AuthGuard} from "./guards/auth.guard";
import {AcceptInvitationComponent} from "./components/accept-invitation/accept-invitation.component";
import {AppointmentDetailComponent} from "./components/appointment-detail/appointment-detail.component";
import {AcceptInvitationGuard} from "./guards/accept-invitation.guard";
import {TaskListComponent} from "./components/task-list/task-list.component";

export const routes: Routes = [
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'appointments', component: AppointmentListComponent, canActivate: [AuthGuard] },
  { path: 'appointment/new', component: AppointmentFormComponent, canActivate: [AuthGuard] },
  { path: 'appointment/edit/:id', component: AppointmentFormComponent, canActivate: [AuthGuard] },
  { path: 'appointment/:id', component: AppointmentDetailComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'invite-partner', component: PartnerInviteComponent, canActivate: [AuthGuard] },

  {
    path: 'accept-invitation/:token',
    component: AcceptInvitationComponent,
    canActivate: [AcceptInvitationGuard]
  },

  { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
