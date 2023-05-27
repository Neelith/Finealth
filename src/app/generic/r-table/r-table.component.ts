import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { Observable } from 'rxjs';
import { TableColumnDescriptor } from 'src/app/entities/dto/TableColumnDescriptor';

@Component({
  selector: 'app-r-table',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './r-table.component.html',
  styleUrls: ['./r-table.component.scss'],
})
export class RTableComponent {
  @Input() entities$!: Observable<any>;
  @Input() columns!: TableColumnDescriptor[];
  @Input() headerVisible : boolean = true;
  @Input() detailsButtonVisible : boolean = true;

  @Output() onDeleteEntityEvent = new EventEmitter<any>();
  @Output() onEditEntityEvent = new EventEmitter<any>();
  @Output() onOpenDetailsEvent = new EventEmitter<any>();

  onDeleteEntity(entity: any) {
    this.onDeleteEntityEvent.emit(entity);
  }

  onEditEntity(entity: any) {
    this.onEditEntityEvent.emit(entity);
  }

  onOpenDetails(entity: any) {
    this.onOpenDetailsEvent.emit(entity);
  }

  getColumnNames(columns: TableColumnDescriptor[]) : string[]{
    return columns.map((column) => column.field);
  }
}
