import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { DetailViewDescriptor } from 'src/app/entities/dto/DetailViewDescriptor';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

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

  subscription : Subscription = new Subscription();
  isScreenMoreThanSmall: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver
  ) {
    this.subscription.add(
      this.breakpointObserver
        .observe([
          Breakpoints.XSmall,
          Breakpoints.Small,
          Breakpoints.Medium,
          Breakpoints.Large,
          Breakpoints.XLarge,
        ])
        .subscribe((result: BreakpointState) => {
          if (!result.breakpoints[Breakpoints.XSmall]) {
            this.isScreenMoreThanSmall = true;
          }
        })
    );
  }

  onBackEvent() {
    this.OnBackEvent.emit();
  }
}
