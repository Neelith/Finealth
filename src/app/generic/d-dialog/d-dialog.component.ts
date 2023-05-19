import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-d-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './d-dialog.component.html',
  styleUrls: ['./d-dialog.component.scss'],
})
export class DDialogComponent {
  constructor(public dialogRef: MatDialogRef<DDialogComponent>) {}
}
