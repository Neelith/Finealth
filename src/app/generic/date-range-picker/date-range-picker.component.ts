import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
})
export class DateRangePickerComponent {

  @Output() OnDateRangeSelection = new EventEmitter<Date[]>();

  onDateRangeChange(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    if (dateRangeStart.value && dateRangeEnd.value) {
      const startDate = this.getDate(dateRangeStart.value);
      const endDate = this.getDate(dateRangeEnd.value);
      this.OnDateRangeSelection.emit([startDate, endDate])
    }
  }

  private getDate(str : string) : Date{
    const [day, month, year] = str.split('/');
    const date = new Date(+year, +month - 1, +day);
    return date;
  }
}
