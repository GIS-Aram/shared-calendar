import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormComponent } from '../task-form/task-form.component';
import { CommonModule } from "@angular/common";
import { MatListModule } from "@angular/material/list";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import {DeleteConfirmationDialogComponent} from "../delete-confirmation-dialog/delete-confirmation-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../services/auth.service";
import {MatMenu, MatMenuItem, MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {MatExpansionModule, MatExpansionPanel, MatExpansionPanelTitle} from "@angular/material/expansion";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatCheckboxModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatMenuModule,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionModule,
    TranslateModule
  ],
  template: `
<!--    <mat-card class="task-card">-->
<!--      <mat-card-header>-->
<!--        <mat-card-title>Taken</mat-card-title>-->
<!--      </mat-card-header>-->
<!--      <mat-card-content>-->
<!--        <mat-list>-->
<!--          <mat-list-item *ngFor="let task of tasks">-->
<!--            <mat-checkbox [(ngModel)]="task.completed" (change)="updateTask(task)" color="primary">-->
<!--              {{ task.title }}-->
<!--            </mat-checkbox>-->
<!--            <span class="task-info">-->
<!--              Gemaakt door: {{ task.createdBy?.email }}-->
<!--              <ng-container *ngIf="task.updatedBy">-->
<!--                | Bijgewerkt door: {{ task.updatedBy.email }}-->
<!--              </ng-container>-->
<!--            </span>-->
<!--            <span class="spacer"></span>-->
<!--&lt;!&ndash;            <button mat-icon-button (click)="editTask(task)" *ngIf="canEditTask(task)" matTooltip="Bewerk taak">&ndash;&gt;-->
<!--&lt;!&ndash;              <mat-icon>edit</mat-icon>&ndash;&gt;-->
<!--&lt;!&ndash;            </button>&ndash;&gt;-->
<!--&lt;!&ndash;            <button mat-icon-button color="warn" (click)="deleteTask(task._id)" *ngIf="canEditTask(task)" matTooltip="Verwijder taak">&ndash;&gt;-->
<!--&lt;!&ndash;              <mat-icon>delete</mat-icon>&ndash;&gt;-->
<!--&lt;!&ndash;            </button>&ndash;&gt;-->

<!--            <button mat-icon-button [matMenuTriggerFor]="menu" matTooltip="Opties">-->
<!--              <mat-icon>more_vert</mat-icon>-->
<!--            </button>-->
<!--            <mat-menu #menu="matMenu">-->
<!--              <button mat-menu-item (click)="editTask(task)" *ngIf="canEditTask(task)" >-->
<!--                <mat-icon>edit</mat-icon>-->
<!--                <span>Bewerk taak</span>-->
<!--              </button>-->
<!--              <button mat-menu-item (click)="deleteTask(task._id)" color="warn" *ngIf="canEditTask(task)" >-->
<!--                <mat-icon>delete</mat-icon>-->
<!--                <span>Verwijder taak</span>-->
<!--              </button>-->
<!--            </mat-menu>-->
<!--          </mat-list-item>-->
<!--        </mat-list>-->
<!--      </mat-card-content>-->
<!--      <mat-card-actions>-->
<!--        <button mat-raised-button color="primary" (click)="openTaskForm()">Nieuwe Taak</button>-->
<!--      </mat-card-actions>-->
<!--    </mat-card>-->
    <h1 class="page-title">{{ 'TASKS' | translate }}</h1>
    <div class="task-list">
      <mat-card *ngFor="let task of tasks" class="task-card">
        <mat-card-content>
          <div class="task-header">
            <mat-checkbox [(ngModel)]="task.completed" (change)="updateTask(task)" color="primary">
              {{ task.title }}
            </mat-checkbox>
<!--            <button mat-icon-button [matMenuTriggerFor]="menu">-->
<!--              <mat-icon>more_vert</mat-icon>-->
<!--            </button>-->
            <div class="task-indicators">
              <span class="action-count" *ngIf="getOpenActionCount(task) > 0">
                {{ getOpenActionCount(task) }}
                <mat-icon>playlist_add_check</mat-icon>
              </span>
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
            </div>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="editTask(task)" *ngIf="canEditTask(task)">
                <mat-icon>edit</mat-icon>
                <span>Bewerk</span>
              </button>
              <button mat-menu-item (click)="deleteTask(task._id)" *ngIf="canEditTask(task)">
                <mat-icon>delete</mat-icon>
                <span>Verwijder</span>
              </button>
            </mat-menu>
          </div>
          <div class="task-info">
            <small>Gemaakt door: {{ task.createdBy?.email }}</small>
            <small *ngIf="task.updatedBy">Bijgewerkt door: {{ task.updatedBy.email }}</small>
          </div>

          <mat-expansion-panel class="task-details">
            <mat-expansion-panel-header>
              <mat-panel-title>
                Details
              </mat-panel-title>
            </mat-expansion-panel-header>
            <p *ngIf="task.description">Beschrijving: {{ task.description }}</p>
            <p *ngIf="task.dueDate">Einddatum: {{ task.dueDate | date }}</p>
            <div *ngIf="task.actions && task.actions.length > 0">
              <h4>Actiepunten:</h4>
              <ul>
                <li *ngFor="let action of task.actions">
                  <mat-checkbox [(ngModel)]="action.completed" (change)="updateTask(task)">
                    {{ action.description }}
                  </mat-checkbox>
                </li>
              </ul>
            </div>
          </mat-expansion-panel>
        </mat-card-content>
      </mat-card>
    </div>
    <button mat-fab color="primary" class="add-task-button" (click)="openTaskForm()">
      <mat-icon>add</mat-icon>
    </button>

  `,
  styles: [`
    .page-title {
      font-size: 24px; /* Verhoog dit voor een grotere tekst */
      color: #3f51b5; /* Of gebruik een kleur die bij je stijl past */
      margin-bottom: 16px; /* Ruimte onder de titel */
      text-align: center; /* Of gebruik left of right afhankelijk van je behoefte */
    }
    //mat-card {
    //  max-width: 800px;
    //  margin: 20px auto;
    //}
    //.spacer {
    //  flex: 1 1 auto;
    //}
    //mat-list-item {
    //  margin-bottom: 10px;
    //}
    //.task-info {
    //  font-size: 0.8em;
    //  color: #666;
    //  margin-left: 10px;
    //}


    //.task-card {
    //  max-width: 800px;
    //  margin: 20px auto;
    //  padding: 10px;
    //  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    //  border-radius: 8px;
    //}
    //
    //@media (max-width: 600px) {
    //  .task-card {
    //    margin: 10px;
    //    padding: 5px;
    //  }
    //}
    //
    //.spacer {
    //  flex: 1 1 auto;
    //}
    //
    //.task-info {
    //  font-size: 0.8em;
    //  color: #666;
    //  margin-left: 10px;
    //  flex-wrap: wrap;
    //  overflow: hidden;
    //  text-overflow: ellipsis;
    //  white-space: nowrap;
    //  max-width: 150px;
    //}
    //
    //mat-list-item {
    //  margin-bottom: 10px;
    //  display: flex;
    //  align-items: center;
    //}
    //
    //mat-icon-button {
    //  padding: 8px;
    //}
    //
    //mat-menu {
    //  display: flex;
    //  flex-direction: column;
    //}

    .task-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      padding: 16px;
    }

    .task-card {
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .task-info {
      display: flex;
      flex-direction: column;
      font-size: 0.8em;
      color: #666;
      margin-top: 8px;
      margin-bottom: 8px;
    }

    .task-details {
      margin-top: 8px;
    }

    .add-task-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
    }

    @media (max-width: 600px) {
      .task-list {
        grid-template-columns: 1fr;
      }
    }

    .task-indicators {
      display: flex;
      align-items: center;
    }

    .action-count {
      display: flex;
      align-items: center;
      background-color: #e0e0e0;
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 12px;
      margin-right: 8px;
    }

    .action-count mat-icon {
      font-size: 16px;
      height: 16px;
      width: 16px;
      margin-left: 4px;
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(
      tasks => this.tasks = tasks,
      error => console.error('Error loading tasks', error)
    );
  }

  openTaskForm(task?: any) {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '400px',
      data: task ? { ...task } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result._id) {
          this.taskService.updateTask(result._id, result).subscribe(
            () => this.loadTasks(),
            error => console.error('Error updating task', error)
          );
        } else {
          this.taskService.createTask(result).subscribe(
            () => this.loadTasks(),
            error => console.error('Error creating task', error)
          );
        }
      }
    });
  }

  editTask(task: any) {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '400px',
      data: { ...task, actions: task.actions || [] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.updateTask(result._id, result).subscribe(
          () => {
            console.log('Task updated', task);
            this.loadTasks();
          },
          error => console.error('Error updating task', error)
        );
      }
    });
  }

  updateTask(task: any) {
    this.taskService.updateTask(task._id, task).subscribe(
      () => {},
      error => console.error('Error updating task', error)
    );
  }

  deleteTask(id: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(id).subscribe(
          () => {
            this.snackBar.open('Taak succesvol verwijderd', 'Sluiten', { duration: 3000 });
            this.loadTasks();
          },
          (error) => {
            console.error('Fout bij het verwijderen van de taak', error);
            this.snackBar.open('Fout bij het verwijderen van de taak', 'Sluiten', { duration: 3000 });
          }
        );
      }
    });
  }

  canEditTask(task: any): boolean {
    const currentUserId = this.authService.getCurrentUserId();
    const partnerUserId = this.authService.getPartnerUserId();
    return task.userId === currentUserId ||
      (task.sharedWith && task.sharedWith.includes(currentUserId)) ||
      task.userId === partnerUserId ||
      (task.sharedWith && task.sharedWith.includes(partnerUserId));
  }

  getOpenActionCount(task: any): number {
    return task.actions ? task.actions.filter((action: any) => !action.completed).length : 0;
  }
}
