import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notificatie.service';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <mat-form-field>
        <input matInput placeholder="Email" [(ngModel)]="user.email" name="email" required>
      </mat-form-field>
      <mat-form-field>
        <input matInput type="password" placeholder="Wachtwoord" [(ngModel)]="user.password" name="password" (input)="validatePassword()" required>
      </mat-form-field>
      <div class="password-requirements">
        <p *ngFor="let requirement of passwordRequirements">
          <mat-icon *ngIf="requirement.met" color="primary">check_circle</mat-icon>
          <mat-icon *ngIf="!requirement.met" color="warn">cancel</mat-icon>
          {{ requirement.label }}
        </p>
      </div>
      <mat-form-field>
        <input matInput type="password" placeholder="Bevestig Wachtwoord" [(ngModel)]="confirmPassword" name="confirmPassword" required>
      </mat-form-field>
      <button class="register-btn" mat-raised-button color="primary" type="submit">Registreren</button>
    </form>
  `,
  styles: [`
    mat-form-field {
      width: 80%;
      margin: 0 auto;
      display: block;
    }
    .password-requirements {
      margin: 10px 0;
      padding: 0 10%;
      font-size: 14px;
      color: #555;
    }
    .password-requirements p {
      margin: 4px 0;
      display: flex;
      align-items: center;
    }
    .register-btn {
      display: block;
      width: 80%;
      margin: 20px auto 0 auto;
      background-color: #3f51b5;
      color: white;
      font-weight: bold;
      text-transform: uppercase;
      padding: 12px;
      line-height: 12px; /* Zorg ervoor dat de line-height gelijk is aan de padding voor verticale centrering */
      border-radius: 4px;
      box-shadow: 0px 3px 6px rgba(0,0,0,0.16);
      text-align: center; /* Zorgt ervoor dat de tekst ook horizontaal gecentreerd is */
      transition: background-color 0.3s ease;
    }
    .register-btn:hover {
      background-color: #303f9f;
    }
  `]

})
export class RegisterComponent {
  user: any = {};
  confirmPassword: string = '';
  passwordRequirements = [
    { label: 'Minimaal 8 tekens', met: false },
    { label: 'Minstens één cijfer', met: false },
    { label: 'Minstens één kleine letter', met: false },
    { label: 'Minstens één hoofdletter', met: false },
    { label: 'Minstens één speciaal teken (!@#$%^&*)', met: false }
  ];


  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  validatePassword() {
    const password = this.user.password || '';
    this.passwordRequirements[0].met = password.length >= 8;
    this.passwordRequirements[1].met = /\d/.test(password);
    this.passwordRequirements[2].met = /[a-z]/.test(password);
    this.passwordRequirements[3].met = /[A-Z]/.test(password);
    this.passwordRequirements[4].met = /[!@#$%^&*]/.test(password);
  }

  onSubmit() {
    if (this.user.password !== this.confirmPassword) {
      this.notificationService.showError('Wachtwoorden komen niet overeen', '');
      return;
    }

    const allRequirementsMet = this.passwordRequirements.every(req => req.met);
    if (!allRequirementsMet) {
      this.notificationService.showError('Wachtwoord voldoet niet aan alle eisen', '');
      return;
    }

    this.authService.register(this.user).subscribe(
      () => {
        this.notificationService.showSuccess('Registratie succesvol', '');
        this.router.navigate(['/login']);
      },
      error => {
        if (error.status === 400 && error.error.message === 'User already exists') {
          this.notificationService.showError('Dit e-mailadres is al geregistreerd', '');
        } else {
          this.notificationService.showError('Registratie mislukt', '');
        }
      }
    );
  }
}
