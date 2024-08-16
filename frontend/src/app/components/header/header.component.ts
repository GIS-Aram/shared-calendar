import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notificatie.service';
import {MatIconModule} from "@angular/material/icon";
import {MatDialog} from "@angular/material/dialog";
import {LogoutConfirmationDialogComponent} from "../logout-confirmation-dialog/logout-confirmation-dialog.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatFormField, MatOption, MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule, TranslateModule, MatSelect, MatOption, MatFormField],
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
  <span class="app-title">{{ 'APP_TITLE' | translate }}</span>
  <span class="spacer"></span>
  <ng-container *ngIf="!authService.isLoggedIn()">
    <a mat-button routerLink="/login" routerLinkActive="active">{{ 'LOGIN' | translate }}</a>
    <a mat-button routerLink="/register" routerLinkActive="active">{{ 'REGISTER' | translate }}</a>
  </ng-container>
  <ng-container *ngIf="authService.isLoggedIn()">
    <a mat-button routerLink="/calendar" routerLinkActive="active">{{ 'CALENDAR' | translate }}</a>
    <a mat-button routerLink="/appointments" routerLinkActive="active">{{ 'APPOINTMENTS' | translate }}</a>
    <a mat-button routerLink="/invite-partner" routerLinkActive="active">{{ 'INVITE_PARTNER' | translate }}</a>
    <button mat-button (click)="logout()" class="logout-btn">{{ 'LOGOUT' | translate }}</button>
  </ng-container>
<!--  <mat-form-field appearance="outline" class="language-select">-->
<!--    <mat-select [value]="currentLang" (selectionChange)="changeLanguage($event.value)">-->
<!--      <mat-option value="en">-->
<!--        <img src="assets/flags/en.png" alt="English" class="lang-icon" /> EN-->
<!--      </mat-option>-->
<!--      <mat-option value="nl">-->
<!--        <img src="assets/flags/nl.png" alt="Nederlands" class="lang-icon" /> NL-->
<!--      </mat-option>-->
<!--    </mat-select>-->
<!--  </mat-form-field>-->
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

    // Language Dropdown
    .language-select {
      width: 100px; /* Aanpasbare breedte */
      margin-right: -18px;
      margin-left: auto; /* Verschuif naar rechts */
      margin-top: 15px;

      ::ng-deep .mat-mdc-select-value-text {
        padding-left: 16px;
      }

      mat-form-field {
        display: flex;
        justify-content: flex-end; /* Zorg dat de select naar rechts wordt uitgelijnd */
      }

      mat-select {
        background-color: white;
        border-radius: 4px;
      }

      mat-select-trigger {
        font-weight: bold;
        color: #000; /* Zwart, zodat het beter leesbaar is */
        display: flex;
        justify-content: center; /* Horizontaal centreren */
        align-items: center; /* Zorgt ervoor dat de items verticaal gecentreerd zijn */
      }

      .mat-select-arrow {
        margin-left: auto; /* Zorg dat de pijl aan de rechterkant staat */
        color: black; /* Zwart, om bij de tekst te passen */
      }

      .lang-icon {
        width: 16px;  /* Maak het icoon kleiner */
        height: auto; /* Automatische hoogte om de verhoudingen te behouden */
        margin-right: 4px; /* Ruimte tussen het icoon en de tekst */
        //vertical-align: middle; /* Uitlijning van het icoon met de tekst */
        //object-fit: contain; /* Zorg ervoor dat de afbeelding past binnen de gegeven dimensies */
      }

      mat-option {
        display: flex;
        align-items: center; /* Zorg dat de iconen en tekst in het midden zijn uitgelijnd */
        height: 36px; /* Verklein de hoogte van de opties */
      }

      /* Verklein de grootte van de dropdown */
      .mat-select-panel {
        min-width: 120px; /* Bepaal een minimale breedte voor de dropdown */
        max-height: 200px; /* Beperk de maximale hoogte van de dropdown */
      }
    }


  `]
})
export class HeaderComponent {
  @Output() menuToggle = new EventEmitter<void>();
  currentLang = 'nl'; // Standaardtaal instellen
  constructor(
    public authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {
    // De standaardtaal instellen op basis van de ingestelde taal in de service
    this.currentLang = this.translate.currentLang || this.translate.getDefaultLang();
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
      }
    });
  }

  changeLanguage(lang: string) {
    this.currentLang = lang; // Werk de huidige taal bij
    this.translate.use(lang);
  }
}
