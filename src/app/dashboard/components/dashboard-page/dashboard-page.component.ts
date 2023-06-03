import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, KeyValue } from '@angular/common';
import { EchartOptionsService } from '../../services/echart-options.service';
import { CashMovementRepositoryService } from 'src/app/indexedDb/repositories/cash-movement-repository/cash-movement-repository.service';
import { CategoryRepositoryService } from 'src/app/indexedDb/repositories/category-repository/category-repository.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { CashMovement } from 'src/app/entities/model/Cash-Movement';
import { Category } from 'src/app/entities/model/Category';
import { NgxEchartsModule } from 'ngx-echarts';
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from '@angular/cdk/layout';
import { CashMovementType } from 'src/app/entities/enums/CashMovementType';
import { DateRangePickerComponent } from 'src/app/generic/date-range-picker/date-range-picker.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule, DateRangePickerComponent],
  providers: [EchartOptionsService],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  cashMovements: CashMovement[] = [];
  categories: Category[] = [];
  isSearchFiltered: boolean = false;

  inputDataValid: boolean = false;
  categoryChartOptions: any;
  categoryChartUpdateOptions: any;
  cashMovementTypeChartOptions: any;
  cashMovementTypeChartUpdateOptions: any;
  enableCategoryGraphLabels: boolean = false;

  constructor(
    private categoryRepository: CategoryRepositoryService,
    private cashMovementRepository: CashMovementRepositoryService,
    private echartOptionsService: EchartOptionsService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.subscription.add(
      this.breakpointObserver
        .observe([Breakpoints.XSmall])
        .subscribe((result: BreakpointState) => {
          if (!result.breakpoints[Breakpoints.XSmall]) {
            this.enableCategoryGraphLabels = true;
          }
        })
    );
  }

  async ngOnInit() {
    this.categoryChartOptions =
      this.echartOptionsService.getCategoryChartInitOptions(
        this.enableCategoryGraphLabels,
        'Dove sono finiti i miei soldi?!'
      );

    this.cashMovementTypeChartOptions =
      this.echartOptionsService.getCategoryChartInitOptions(
        this.enableCategoryGraphLabels,
        'Spese divise per priorità'
      );

    this.cashMovements = await this.getCashMovementsAsync();
    this.categories = await this.getCategoriesAsync();

    this.loadGraphData(this.categories, this.cashMovements);
  }

  async reloadCategoryChartData() {
    this.isSearchFiltered = false;
    this.cashMovements = await this.getCashMovementsAsync();
    this.categories = await this.getCategoriesAsync();
  }

  async filterChartData(dates: Date[]) {
    const startDate = dates[0];
    const endDate = dates[1];

    const filteredMovements = this.cashMovements.filter((movement) => {
      const movementDate = new Date(movement.date);
      return movementDate >= startDate && movementDate <= endDate;
    });

    this.loadGraphData(this.categories, filteredMovements);
  }

  private async getCashMovementsAsync() {
    return firstValueFrom(this.cashMovementRepository.getAll());
  }

  private async getCategoriesAsync() {
    return firstValueFrom(this.categoryRepository.getAll());
  }

  private getCategoryGraphData(
    categories: Category[],
    cashMovements: CashMovement[]
  ): KeyValue<string, number>[] {
    return categories
      .map((category) => {
        let cashMovementsGroupedByCategory = cashMovements.filter(
          (cashMovement) =>
            cashMovement.categoryId === category.categoryId &&
            cashMovement.cashMovementTypeId != CashMovementType.ENTRATA
        );

        let totalAmount = cashMovementsGroupedByCategory.reduce(
          (sum, cashMovement) => sum + Math.abs(cashMovement.amount),
          0
        );

        return {
          key: category.name,
          value: totalAmount,
        };
      })
      .filter((data) => data.value !== 0)
      .sort((a, b) => a.value - b.value);
  }

  private getCashMovementTypeGraphData(
    cashMovements: CashMovement[]
  ): KeyValue<string, number>[] {
    const groupedCashMovements = cashMovements.reduce((acc, cashMovement) => {
      const key = cashMovement.cashMovementTypeId;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(cashMovement);
      return acc;
    }, {} as Record<CashMovementType, CashMovement[]>);

    if (!groupedCashMovements) return [];

    const enumKeys = Object.keys(CashMovementType).filter(
      (key) =>
        isNaN(Number(key)) && key !== CashMovementType[CashMovementType.ENTRATA]
    );

    let keyValues: KeyValue<string, number>[] = [];
    for (const enumKey of enumKeys) {
      const cashMovementsInGroup =
        groupedCashMovements[
          CashMovementType[enumKey as keyof typeof CashMovementType]
        ];

      if (!cashMovementsInGroup) continue;

      const sumOfAmounts = cashMovementsInGroup.reduce(
        (acc, cashMovement) => acc + Math.abs(cashMovement.amount),
        0
      );

      keyValues.push({ key: enumKey, value: sumOfAmounts });
    }

    return keyValues.sort((a, b) => a.value - b.value);
  }

  private loadGraphData(categories: Category[], cashMovements: CashMovement[]) {
    const categoryGraphData = this.getCategoryGraphData(
      categories,
      cashMovements
    );

    this.categoryChartUpdateOptions =
      this.echartOptionsService.getCategoryChartOptions(categoryGraphData);

    const cashMovementTypeGraphData =
      this.getCashMovementTypeGraphData(cashMovements);

    this.cashMovementTypeChartUpdateOptions =
      this.echartOptionsService.getCategoryChartOptions(
        cashMovementTypeGraphData
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
