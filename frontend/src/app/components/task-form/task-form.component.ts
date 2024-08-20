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
import {animate, style, transition, trigger} from "@angular/animations";
import {TranslateModule} from "@ngx-translate/core";

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
    MatIconModule,
    TranslateModule
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('600ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ],
  template: `
    <h2 mat-dialog-title>{{ task._id ? 'Bewerk Taak' : 'Nieuwe Taak' }}</h2>
    <mat-dialog-content>
      <form (ngSubmit)="onSubmit()" #taskForm="ngForm">
        <mat-form-field appearance="fill">
          <mat-label>{{'TITLE' | translate}}</mat-label>
          <input matInput [(ngModel)]="stagingTask.title" name="title" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>{{'DESCRIPTION' | translate}}</mat-label>
          <textarea matInput [(ngModel)]="stagingTask.description" name="description" rows="3"></textarea>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Einddatum</mat-label>
          <input matInput [matDatepicker]="picker" [(ngModel)]="stagingTask.dueDate" name="dueDate">
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
        <div *ngFor="let action of stagingTask.actions; let i = index">
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
        <button class="btn bg-primary btn-font-color" mat-button (click)="addAction($event)">
          {{stagingTask.actions && stagingTask.actions.length ? 'Voeg nog een actiepunt toe' : 'Actiepunt toevoegen' }}
        </button>

        <div *ngIf="stagingTask.actions.length === 0" class="no-actions" @fadeInOut>
          Er zijn geen actiepunten toegevoegd aan deze taak.
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Annuleren</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="stagingTask" [disabled]="!taskForm.form.valid">
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
    .btn-font-color {
      color: white;
    }
    .no-actions {
      background-color: #f9f9f9;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 10px;
      text-align: center;
      font-size: 14px;
      color: #666;
      margin-top: 20px;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class TaskFormComponent implements OnInit {
  task: any = {};
  newAction: string = '';
  stagingTask: any = {}; // Gebruik een aparte stagingTask voor tijdelijke wijzigingen

  constructor(public dialogRef: MatDialogRef<TaskFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    if (this.data) {
      // Werk met stagingTask voor bewerken en terugzetten
      this.stagingTask = JSON.parse(JSON.stringify(this.data));

      this.task = {...this.data};
      if (!this.stagingTask.actions) {
        this.stagingTask.actions = [];
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.stagingTask.title) {
      // Pas de wijzigingen toe van stagingTask naar task bij bevestiging
      this.task = JSON.parse(JSON.stringify(this.stagingTask));

      this.dialogRef.close(this.task);
    }
  }

  addAction(event: Event): void {
    event.preventDefault(); // Voorkom dat het formulier wordt verzonden

    if (this.newAction.trim()) {
      if (!this.stagingTask.actions) {
        this.stagingTask.actions = [];
      }
      this.stagingTask.actions.push({ description: this.newAction, completed: false });
      this.newAction = '';
    }
  }

  removeAction(index: number): void {
    this.stagingTask.actions.splice(index, 1);
  }
}
