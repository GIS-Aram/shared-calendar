import { Injectable } from '@angular/core';
import {IndividualConfig, ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  private createConfig(): Partial<IndividualConfig> {
    return {
      toastClass: 'ngx-toastr custom-toast',
      positionClass: 'toast-top-right', // Je kunt de positie hier aanpassen
      closeButton: true,
      tapToDismiss: true,
      newestOnTop: true,
      progressBar: true,
    };
  }

  showSuccess(message: string, title: string) {
    console.log('showSuccess called');
    this.toastr.success(message, title);
    // this.toastr.success(message, title, this.createConfig());
  }

  showError(message: string, title: string) {
    this.toastr.error(message, title);
  }

  showInfo(message: string, title: string) {
    this.toastr.info(message, title);
  }

  showWarning(message: string, title: string) {
    this.toastr.warning(message, title);
  }
}




// import { Injectable } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class NotificationService {
//   constructor(private snackBar: MatSnackBar) {}
//
//   showSuccess(message: string) {
//     this.snackBar.open(message, 'Sluiten', {
//       duration: 3000,
//       panelClass: ['success-snackbar'],
//       horizontalPosition: 'center',
//       verticalPosition: 'top'
//     });
//   }
//
//   showError(message: string) {
//     this.snackBar.open(message, 'Sluiten', {
//       duration: 5000,
//       panelClass: ['error-snackbar'],
//       horizontalPosition: 'center',
//       verticalPosition: 'top'
//     });
//   }
//
//   showInfo(message: string) {
//     this.snackBar.open(message, 'Sluiten', {
//       duration: 4000,
//       panelClass: ['info-snackbar'],
//       horizontalPosition: 'center',
//       verticalPosition: 'bottom'
//     });
//   }
// }
