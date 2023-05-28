import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { Observable, Subscription } from 'rxjs';
import { TableColumnDescriptor } from 'src/app/entities/dto/TableColumnDescriptor';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-r-table',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './r-table.component.html',
  styleUrls: ['./r-table.component.scss'],
})
export class RTableComponent implements OnChanges, OnDestroy {
  @Input() entities$!: Observable<any>;
  @Input() columns!: TableColumnDescriptor[];
  @Input() headerVisible: boolean = true;
  @Input() detailsButtonVisible: boolean = true;

  @Output() onDeleteEntityEvent = new EventEmitter<any>();
  @Output() onEditEntityEvent = new EventEmitter<any>();
  @Output() onOpenDetailsEvent = new EventEmitter<any>();

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private subscription: Subscription = new Subscription();

  ngOnChanges(changes: SimpleChanges): void {
    if (this.entities$) {
      this.subscription.add(
        this.entities$.subscribe((entities) => {
          this.dataSource.data = entities;
          this.dataSource.paginator = this.paginator;
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onDeleteEntity(entity: any) {
    this.onDeleteEntityEvent.emit(entity);
  }

  onEditEntity(entity: any) {
    this.onEditEntityEvent.emit(entity);
  }

  onOpenDetails(entity: any) {
    this.onOpenDetailsEvent.emit(entity);
  }

  getColumnNames(columns: TableColumnDescriptor[]): string[] {
    return columns.map((column) => column.field);
  }
}
