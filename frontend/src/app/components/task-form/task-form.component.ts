import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";
import {MatIcon, MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckbox,
    MatIcon,
    MatCheckboxModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ task._id ? 'Bewerk Taak' : 'Nieuwe Taak' }}</h2>
    <mat-dialog-content>
      <form (ngSubmit)="onSubmit()" #taskForm="ngForm">
        <mat-form-field appearance="fill">
          <mat-label>Titel</mat-label>
          <input matInput [(ngModel)]="task.title" name="title" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Beschrijving</mat-label>
          <textarea matInput [(ngModel)]="task.description" name="description" rows="3"></textarea>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Einddatum</mat-label>
          <input matInput [matDatepicker]="picker" [(ngModel)]="task.dueDate" name="dueDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

<!--        <h3>Actiepunten</h3>-->
<!--        <div *ngFor="let action of data.actions; let i = index">-->
<!--          <mat-checkbox [(ngModel)]="action.completed" name="action{{i}}">-->
<!--            {{ action.description }}-->
<!--          </mat-checkbox>-->
<!--          <button mat-icon-button (click)="removeAction(i)">-->
<!--            <mat-icon>delete</mat-icon>-->
<!--          </button>-->
<!--        </div>-->
<!--        <mat-form-field>-->
<!--          <input matInput [(ngModel)]="newAction" placeholder="Nieuw actiepunt" name="newAction">-->
<!--        </mat-form-field>-->
<!--        <button mat-button (click)="addAction()">Actiepunt toevoegen</button>-->

        <h3>Actiepunten</h3>
        <div *ngFor="let action of task.actions; let i = index">
          <mat-checkbox [(ngModel)]="action.completed" name="action{{i}}">
            {{ action.description }}
          </mat-checkbox>
          <button mat-icon-button color="warn" (click)="removeAction(i)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
        <mat-form-field>
          <input matInput [(ngModel)]="newAction" placeholder="Nieuw actiepunt" name="newAction">
        </mat-form-field>
        <button mat-button (click)="addAction($event)">Actiepunt toevoegen</button>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Annuleren</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="task" [disabled]="!taskForm.form.valid">
        {{ task._id ? 'Bijwerken' : 'Toevoegen' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 15px;
    }
    textarea {
      min-height: 100px;
    }
  `]
})
export class TaskFormComponent implements OnInit {
  task: any = {};
  newAction: string = '';

  constructor(public dialogRef: MatDialogRef<TaskFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    if (this.data) {
      this.task = {...this.data};
      if (!this.task.actions) {
        this.task.actions = [];
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.task.title) {
      // Zorg ervoor dat de actiepunten correct worden toegevoegd aan de taak
      this.task.actions = this.task.actions || [];

      this.dialogRef.close(this.task);
    }
  }

  addAction(event: Event): void {
    event.preventDefault(); // Voorkom dat het formulier wordt verzonden

    if (this.newAction.trim()) {
      if (!this.task.actions) {
        this.task.actions = [];
      }
      this.task.actions.push({ description: this.newAction, completed: false });
      this.newAction = '';
    }
  }

  removeAction(index: number): void {
    this.task.actions.splice(index, 1);
  }
}
