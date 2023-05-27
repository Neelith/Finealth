import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { DetailViewDescriptor } from 'src/app/entities/dto/DetailViewDescriptor';

@Component({
  selector: 'app-generic-view',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './generic-view.component.html',
  styleUrls: ['./generic-view.component.scss'],
})
export class GenericViewComponent{
  @Input() detailsViewDescriptors! : DetailViewDescriptor[];
  @Input() backButtonText: string = 'Back';
  @Output() OnBackEvent = new EventEmitter<void>();

  onBackEvent() {
    this.OnBackEvent.emit();
  }
}
