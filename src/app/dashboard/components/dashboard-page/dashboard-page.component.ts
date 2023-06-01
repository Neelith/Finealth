import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EchartOptionsService } from '../../services/echart-options.service';
import { CashMovementRepositoryService } from 'src/app/indexedDb/repositories/cash-movement-repository/cash-movement-repository.service';
import { CategoryRepositoryService } from 'src/app/indexedDb/repositories/category-repository/category-repository.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  providers: [EchartOptionsService],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit{
  
  constructor(
    private categoryRepository: CategoryRepositoryService,
    private cashMovementRepository: CashMovementRepositoryService
  ) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
