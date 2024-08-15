import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notificatie.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <mat-form-field>
        <input matInput placeholder="Email" [(ngModel)]="user.email" name="email" required>
      </mat-form-field>
      <mat-form-field>
        <input matInput type="password" placeholder="Wachtwoord" [(ngModel)]="user.password" name="password" required>
      </mat-form-field>
      <button class="login-btn" mat-raised-button color="primary" type="submit">Inloggen</button>
    </form>
  `,
  styles: [`
    mat-form-field {
      width: 80%;
      margin: 0 auto;
      display: block;
    }
    .login-btn {
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
export class LoginComponent {
  user: any = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  onSubmit() {
    this.authService.login(this.user.email, this.user.password).subscribe(
      () => {
        this.notificationService.showSuccess('', 'Inloggen succesvol');
        this.router.navigate(['/calendar']);
      },
      error => {
        this.notificationService.showError('Inloggen mislukt', '');
      }
    );
  }
}
