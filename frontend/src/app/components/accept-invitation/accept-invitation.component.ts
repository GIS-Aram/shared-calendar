import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-accept-invitation',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule, MatButtonModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Invitation Acceptance</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>{{message}}</p>
          <mat-progress-bar mode="indeterminate" *ngIf="loading"></mat-progress-bar>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="navigate()" *ngIf="!loading">
            {{needsRegistration ? 'Complete Registration' : 'Go to Login'}}
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    mat-card {
      max-width: 400px;
      width: 100%;
      text-align: center;
    }
    mat-card-content {
      padding: 20px 0;
    }
  `]
})
export class AcceptInvitationComponent implements OnInit {
  message: string = 'Processing your invitation...';
  loading: boolean = true;
  needsRegistration: boolean = false;
  email: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      this.acceptInvitation(token);
    } else {
      this.message = 'Invalid invitation link.';
      this.loading = false;
    }
  }

  acceptInvitation(token: string) {
    this.http.get(`${environment.apiUrl}/invitations/accept/${token}`).subscribe(
      (response: any) => {
        this.message = response.message;
        this.needsRegistration = response.needsRegistration;
        this.email = response.email;
        this.loading = false;
      },
      (error) => {
        this.message = 'Error accepting invitation. Please try again.';
        this.loading = false;
        console.error('Error accepting invitation:', error);
      }
    );
  }

  navigate() {
    if (this.needsRegistration) {
      this.router.navigate(['/register'], { queryParams: { email: this.email } });
    } else {
      this.router.navigate(['/login']);
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
