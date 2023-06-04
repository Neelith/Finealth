import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleBarComponent } from 'src/app/page-title-bar/page-title-bar.component';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-simulation-page',
  standalone: true,
  imports: [CommonModule, PageTitleBarComponent, MaterialModule],
  templateUrl: './simulation-page.component.html',
  styleUrls: ['./simulation-page.component.scss']
})
export class SimulationPageComponent {
  pageTitle: string = 'Simulatori';
}
