import {Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet, RouterLink, RouterLinkActive, Router} from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {HeaderComponent} from "./components/header/header.component";
import {AuthService} from "./services/auth.service";
import {NotificationService} from "./services/notificatie.service";
import {MatDialog} from "@angular/material/dialog";
import {
  LogoutConfirmationDialogComponent
} from "./components/logout-confirmation-dialog/logout-confirmation-dialog.component";
import { TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    HeaderComponent,
    TranslateModule
  ],
//   template: `
// <app-header (menuToggle)="sidenav.toggle()"></app-header>
// <mat-sidenav-container>
//   <mat-sidenav #sidenav mode="side">
//     <mat-nav-list>
//       <a *ngIf="!authService.isLoggedIn()" mat-list-item routerLink="/login" routerLinkActive="active">Login</a>
//       <a *ngIf="!authService.isLoggedIn()" mat-list-item routerLink="/register" routerLinkActive="active">Register</a>
//
//       <a *ngIf="authService.isLoggedIn()" mat-list-item routerLink="/calendar" routerLinkActive="active">Calendar</a>
//       <a *ngIf="authService.isLoggedIn()" mat-list-item routerLink="/appointments" routerLinkActive="active">Appointments</a>
//       <a *ngIf="authService.isLoggedIn()" mat-list-item routerLink="/invite-partner" routerLinkActive="active">Invite Partner</a>
//       <a *ngIf="authService.isLoggedIn()" mat-list-item (click)="logout()" routerLinkActive="active">Logout</a>
//     </mat-nav-list>
//   </mat-sidenav>
//   <mat-sidenav-content>
//     <mat-toolbar>
//       <div class="content">
//         <router-outlet></router-outlet>
//       </div>
//     </mat-toolbar>
//   </mat-sidenav-content>
// </mat-sidenav-container>
//
//   `,
//   // zeker werkende stijlen
//   styles: [`
//   //main {
//   //  padding: 20px;
//   //}
//   :host {
//     display: flex;
//     flex-direction: column;
//     height: 100vh;
//     overflow: hidden; /* Voorkom dat het lichaam zelf scrollt */
//   }
//   mat-toolbar {
//     position: sticky; /* In plaats van fixed */
//     top: 0; /* Zorg ervoor dat het altijd bovenaan blijft */
//     z-index: 2;
//     width: 100%;
//     background: none;
//   }
//   mat-sidenav-container {
//     flex: 1;
//     height: 100vh;
//     //margin-top: 64px;
//     //margin-top: 0;
//     display: flex;
//     flex-direction: column;
//     //padding-top: 64px; /* Zorg ervoor dat de inhoud begint onder de toolbar */
//   }
//   .content {
//     padding: 20px;
//     //margin-top: 300px; /* Zorg ervoor dat de inhoud begint onder de toolbar */
//     flex: 1; /* Zorg ervoor dat de inhoud zich vult binnen de beschikbare ruimte */
//     //overflow: auto;  /* Maakt scrollen mogelijk als de content groter is dan het scherm */
//     height: 100%;
//   }
//   mat-sidenav {
//     width: 250px;
//   }
//   .active {
//     background-color: rgba(0, 0, 0, 0.1);
//   }
//   mat-sidenav-content {
//     height: 100vh; /* Zorg ervoor dat de container de volledige hoogte van het scherm inneemt */
//     overflow-y: auto; /* Sta verticale scroll toe */
//     padding-bottom: 16px; /* Voeg wat ruimte toe aan de randen van de inhoud */
//   }
//   body, html {
//     height: 100%;
//     margin: 0; /* Verwijder standaardmarges die het scrollen kunnen beïnvloeden */
//     overflow: hidden; /* Verwijder scroll van het gehele lichaam en beperk dit tot mat-sidenav-content */
//   }
// `]









  template: `
    <div class="app-container">
      <app-header (menuToggle)="sidenav.toggle()"></app-header>
      <mat-sidenav-container>
        <mat-sidenav #sidenav mode="over">
          <mat-nav-list>
            <a *ngIf="!authService.isLoggedIn()" mat-list-item routerLink="/login" routerLinkActive="active">{{ 'LOGIN' | translate }}</a>
            <a *ngIf="!authService.isLoggedIn()" mat-list-item routerLink="/register" routerLinkActive="active">{{ 'REGISTER' | translate }}</a>
            <a *ngIf="authService.isLoggedIn()" mat-list-item routerLink="/calendar" routerLinkActive="active">{{ 'CALENDAR' | translate }}</a>
            <a *ngIf="authService.isLoggedIn()" mat-list-item routerLink="/appointments" routerLinkActive="active">{{ 'APPOINTMENTS' | translate }}</a>
            <a *ngIf="authService.isLoggedIn()" mat-list-item routerLink="/invite-partner" routerLinkActive="active">{{ 'INVITE_PARTNER' | translate }}</a>
            <a *ngIf="authService.isLoggedIn()" mat-list-item (click)="logout()" routerLinkActive="active">{{ 'LOGOUT' | translate }}</a>
          </mat-nav-list>
        </mat-sidenav>
        <mat-sidenav-content>
          <div class="content">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    mat-sidenav-container {
      flex: 1;
    }
    mat-sidenav {
      width: 250px;
    }
    .content {
      padding: 20px;
      overflow-y: auto;
      height: calc(100vh - 64px); /* Hoogte van het scherm min de hoogte van de header */
    }
    .active {
      background-color: rgba(0, 0, 0, 0.1);
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'shared-calendar-app';
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(public authService: AuthService,
              public notificationService: NotificationService,
              public router: Router,
              private dialog: MatDialog,
              private translate: TranslateService) {
    // Stel de standaardtaal in
    this.translate.setDefaultLang('nl');
    this.translate.use('nl'); // Gebruik standaard NL, kan later veranderd worden
  }

  ngOnInit() {
    this.authService['checkTokenExpiration']();
  }

  logout() {
    // this.authService.logout();
    // this.notificationService.showInfo('U bent uitgelogd', '');
    // this.router.navigate(['/login']);


    const dialogRef = this.dialog.open(LogoutConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
        this.notificationService.showInfo('U bent uitgelogd', '');
        this.router.navigate(['/login']);
        this.sidenav.close();
      }
    });
  }
}
