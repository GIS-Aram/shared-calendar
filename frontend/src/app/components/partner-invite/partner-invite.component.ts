import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {NotificationService} from "../../services/notificatie.service";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-partner-invite',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, TranslateModule],
  template: `
    <div class="invite-form">
      <h2>{{ 'INVITE_PARTNER' | translate }}</h2>
      <form (ngSubmit)="onSubmit()">
        <mat-form-field>
          <input matInput placeholder="Partner's email" [(ngModel)]="partnerEmail" name="partnerEmail" required>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit">Invite</button>
      </form>
    </div>
  `,
  styles: [`
    .invite-form {
      max-width: 300px;
      margin: 0 auto;
      padding: 20px;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 20px;
    }
  `]
})
export class PartnerInviteComponent {
  partnerEmail: string = '';

  constructor(private authService: AuthService,
              private router: Router,
              private notificationService: NotificationService
  ) {}

  onSubmit() {
    this.authService.invitePartner(this.partnerEmail).subscribe(
      (response: any): void => {
        console.log('Partner invited successfully', response);
        // Toon een succesbericht aan de gebruiker
        // alert('Partner invited successfully');
        this.notificationService.showSuccess(`Uitnodiging verstuurd naar ${this.partnerEmail}`, '');
        this.router.navigate(['/calendar']);
      },
      (error: any) => {
        console.error('Error inviting partner', error);
        // Toon een foutmelding aan de gebruiker
        // alert('Error inviting partner. Please try again.');
        this.notificationService.showWarning(`Uitnodiging niet verstuurd naar ${this.partnerEmail}`, '');

      }
    );
  }
}
