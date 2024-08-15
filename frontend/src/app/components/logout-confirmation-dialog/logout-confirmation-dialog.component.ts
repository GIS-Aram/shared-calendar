import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-logout-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Uitloggen</h2>
    <mat-dialog-content>
      Weet u zeker dat u wilt uitloggen?
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Annuleren</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Uitloggen</button>
    </mat-dialog-actions>
  `,
  styleUrl: './logout-confirmation-dialog.component.scss'
})
export class LogoutConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LogoutConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
