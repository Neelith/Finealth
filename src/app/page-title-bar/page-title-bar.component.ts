import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';

@Component({
  selector: 'app-page-title-bar',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './page-title-bar.component.html',
  styleUrls: ['./page-title-bar.component.scss'],
})
export class PageTitleBarComponent {
  @Input() title: string = '';
  @Input() addButtonVisible : boolean = true;
  @Output() onAddEvent: EventEmitter<void> = new EventEmitter();

  onAdd() {
    this.onAddEvent.emit();
  }
}
