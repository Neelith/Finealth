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

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
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
        this.enableCategoryGraphLabels
      );
    this.cashMovements = await this.getCashMovementsAsync();
    this.categories = await this.getCategoriesAsync();

    const categoryGraphData = this.getCategoryGraphData(
      this.categories,
      this.cashMovements
    );

    this.categoryChartUpdateOptions =
      this.echartOptionsService.getCategoryChartOptions(categoryGraphData);
  }

  async reloadCategoryChartData() {
    this.isSearchFiltered = false;
    this.cashMovements = await this.getCashMovementsAsync();
    this.categories = await this.getCategoriesAsync();
  }

  async filterCategoryChartData(data: any) {
    // this.isSearchFiltered = true;
    // let startDateValue = moment(data.startDate.value);
    // let endDateValue = moment(data.endDate.value);
    // endDateValue.hours(23).minutes(59).seconds(59);
    // this.cashMovements = (await this.getCashMovementsAsync()).filter((cm) => {
    //   const cashMovementDate = moment(cm.date);
    //   return cashMovementDate.isBetween(startDateValue, endDateValue);
    // });
    // this.categories = await this.getCategoriesAsync();
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
        let categoryCashMovements = cashMovements.filter(
          (cashMovement) =>
            cashMovement.categoryId === category.categoryId &&
            cashMovement.amount < 0
        );

        let totalAmount = categoryCashMovements.reduce(
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
