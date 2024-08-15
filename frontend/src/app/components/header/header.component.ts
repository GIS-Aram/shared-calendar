import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notificatie.service';
import {MatIconModule} from "@angular/material/icon";
import {MatSidenav} from "@angular/material/sidenav";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
<!--    <mat-toolbar color="primary">-->
<!--      <span>Shared Calendar App</span>-->
<!--      <span class="spacer"></span>-->
<!--      <ng-container *ngIf="authService.currentUserValue">-->
<!--        <span>{{ authService.currentUserValue.email }}</span>-->
<!--        <button mat-button (click)="logout()">Uitloggen</button>-->
<!--      </ng-container>-->
<!--    </mat-toolbar>-->


<!--<mat-toolbar color="primary">-->
<!--  <span>Shared Calendar App</span>-->
<!--  <ng-container *ngIf="!authService.isLoggedIn()">-->
<!--    <a mat-button routerLink="/login" routerLinkActive="active">Login</a>-->
<!--    <a mat-button routerLink="/register" routerLinkActive="active">Register</a>-->
<!--  </ng-container>-->
<!--  <ng-container *ngIf="authService.isLoggedIn()">-->
<!--    <a mat-button routerLink="/calendar" routerLinkActive="active">Calendar</a>-->
<!--    <a mat-button routerLink="/appointments" routerLinkActive="active">Appointments</a>-->
<!--    <a mat-button routerLink="/invite-partner" routerLinkActive="active">Invite Partner</a>-->
<!--    <button mat-button (click)="logout()">Logout</button>-->
<!--  </ng-container>-->
<!--</mat-toolbar>-->


<mat-toolbar color="primary">
  <button mat-icon-button (click)="menuToggle.emit()">
    <mat-icon>menu</mat-icon>
  </button>
  <span class="app-title">Shared Calendar App</span>
  <span class="spacer"></span>
  <ng-container *ngIf="!authService.isLoggedIn()">
    <a mat-button routerLink="/login" routerLinkActive="active">Login</a>
    <a mat-button routerLink="/register" routerLinkActive="active">Register</a>
  </ng-container>
  <ng-container *ngIf="authService.isLoggedIn()">
    <a mat-button routerLink="/calendar" routerLinkActive="active">Calendar</a>
    <a mat-button routerLink="/appointments" routerLinkActive="active">Appointments</a>
    <a mat-button routerLink="/invite-partner" routerLinkActive="active">Invite Partner</a>
    <button mat-button (click)="logout()" class="logout-btn">Logout</button>
  </ng-container>
</mat-toolbar>
  `,
  // styles: [`
  //   .spacer {
  //     flex: 1 1 auto;
  //   }
  //   .active {
  //     background-color: rgba(0, 0, 0, 0.1);
  //   }
  //   mat-toolbar {
  //     display: flex;
  //     justify-content: space-between;
  //   }
  // `]

  // zeker werkende stijlen
  // styles: [`
  //   .spacer {
  //     flex: 1 1 auto;
  //   }
  //   .app-title {
  //     font-weight: bold;
  //     font-size: 20px;
  //   }
  //   mat-toolbar {
  //     display: flex;
  //     align-items: center;
  //     justify-content: space-between;
  //     height: 64px;
  //     padding: 0 16px;
  //   }
  //   mat-icon-button {
  //     margin-right: 10px;
  //   }
  //   .active {
  //     background-color: rgba(0, 0, 0, 0.1);
  //   }
  //   //a[mat-button] {
  //   //  margin-left: 10px;
  //   //}
  //   a[mat-button]  {
  //     display: inline-block !important;
  //     margin-left: 10px;
  //   }
  //   @media (max-width: 600px) {
  //     a[mat-button]  {
  //       display: none !important; /* Verberg de links op schermen kleiner dan 600px */
  //     }
  //   }
  // `]
  styles: [`
    .logout-btn {
      margin-bottom: 4px;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .app-title {
      font-weight: bold;
      font-size: 20px;
    }
    mat-toolbar {
      height: 64px;
      padding: 0 16px;
    }
    .active {
      background-color: rgba(0, 0, 0, 0.1);
    }
    .desktop-only {
      display: none;
    }
    @media (min-width: 768px) {
      .desktop-only {
        display: inline-block !important;
        margin-left: 10px;
      }
    }
       //a[mat-button] {
       //  margin-left: 10px;
       //}
       a[mat-button]  {
         display: inline-block !important;
         margin-left: 10px;
       }
       @media (max-width: 600px) {
         a[mat-button]  {
           display: none !important; /* Verberg de links op schermen kleiner dan 600px */
         }
       }
  `]
})
export class HeaderComponent {
  @Output() menuToggle = new EventEmitter<void>();
  constructor(
    public authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  logout() {
    this.authService.logout();
    this.notificationService.showInfo('U bent uitgelogd', '');
    this.router.navigate(['/login']);
  }
}
