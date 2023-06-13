import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  notifySuccess(
    message: string,
    action: string = 'Chiudi',
    duration: number = 3000
  ) {
    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: ['notification-success'],
    });
  }

  notifyFailure(
    message: string,
    action: string = 'Chiudi',
    duration: number = 3000
  ) {
    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: ['notification-failure'],
    });
  }
}
