import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent{
  @Input() tableEnabled : boolean = true;
  @Input() imgColumnEnabled: boolean = false;
  @Input() actionsColumnEnabled: boolean = false;
  @Input() headerVisible : boolean = true;
  @Input() entities$!: Observable<any>;
  @Input() columns: string[] = [];

  @Output() onDeleteEntityEvent = new EventEmitter<any>();
  @Output() onEditEntityEvent = new EventEmitter<any>();

  onDeleteEntity(entity: any) {
    this.onDeleteEntityEvent.emit(entity);
  }

  onEditEntity(entity: any) {
    this.onEditEntityEvent.emit(entity);
  }
}
