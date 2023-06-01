import { Injectable } from '@angular/core';
import { EChartsOption } from 'echarts';
import { CashMovement } from 'src/app/entities/model/Cash-Movement';
import { Category } from 'src/app/entities/model/Category';

@Injectable({
  providedIn: 'root',
})
export class EchartOptionsService {
  private incomeExpenseChartOptions: EChartsOption = {
    color: ['#00A393', '#D91409', '#F0D701'],
    title: {
      left: '50%',
      text: 'Entrate & risparmi',
      subtext: '',
      textAlign: 'center',
      textStyle: { color: '#00A393' },
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        let result = `${params[0].name}<br/>`;
        let total = 0;
        let income = 0;
        params.forEach((param: any) => {
          if (param.seriesName === 'Entrate') {
            income = param.data;
            total += param.data;
          } else {
            total += param.data;
          }
        });
        params.forEach((param: any) => {
          result += `
            <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${
              param.color
            }"></span>
            ${param.seriesName}: ${param.data} (${
            param.seriesName === 'Entrate'
              ? '100'
              : (Math.abs((param.data / income) * 100)).toFixed(2)
          }%)<br/>
          `;
        });
        return result;
      },
    },
    legend: {
      align: 'auto',
      data: [],
      top: 30,
    },
    grid: {
      left: '25%',
      right: '25%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [],
  };

  private categoryChartOptions: EChartsOption = {
    color: ['#00A393', '#008F81', '#007A6E', '#00665C'],
    title: {
      left: '50%',
      top: '5%',
      text: 'Dove sono finiti i miei soldi?',
      subtext: '',
      textAlign: 'center',
      textStyle: { color: '#00A393' },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : -{c} ({d}%)',
    },
    series: [
      {
        name: 'Categoria',
        type: 'pie',
        radius: [30, 100],
        roseType: 'area',
        data: [],
        label: {
          color: '#009688',
        },
        labelLine: {
          lineStyle: {
            color: '#009688',
          },
          smooth: 0.2,
          length: 10,
          length2: 20,
        },
        itemStyle: {
          shadowBlur: 200,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: () => Math.random() * 200,
      },
    ],
    legend: {
      align: 'auto',
      bottom: 10,
      data: [],
    },
    calculable: true,
  };

  getCategoryChartInitOptions() {
    return this.categoryChartOptions;
  }

  getCategoryChartOptions(
    categories: Category[],
    cashMovements: CashMovement[]
  ) {
    let categoryGraphData = this.getCategoryGraphData(
      categories,
      cashMovements
    );

    return {
      series: [
        {
          data: categoryGraphData,
        },
      ],
      legend: {
        data: categoryGraphData.map((value) => value.name),
      },
    };
  }

  getIncomeExpenseChartInitOptions() {
    return this.incomeExpenseChartOptions;
  }

  getIncomeExpenseChartOptions(cashMovements: CashMovement[]) {
    let incomeExpenseGraphData = this.getIncomeExpenseGraphData(cashMovements);

    return {
      series: [
        {
          name: 'Entrate',
          type: 'line',
          data: incomeExpenseGraphData.series.entrate,
          zlevel: 1,
        },
        {
          name: 'Uscite',
          type: 'line',
          data: incomeExpenseGraphData.series.uscite,
          zlevel: 2,
        },
        {
          name: 'Risparmi',
          type: 'line',
          data: incomeExpenseGraphData.series.risparmi,
          zlevel: 3,
        },
      ],
      legend: {
        data: ['Entrate', 'Uscite', 'Risparmi'],
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: incomeExpenseGraphData.xAxis.data,
      },
    };
  }

  private getIncomeExpenseGraphData(cashMovements: CashMovement[]) {
    const entrate: Record<string, number> = {};
    const uscite: Record<string, number> = {};
    const risparmi: Record<string, number> = {};
    const xAxis = { data: [] as string[] };

    cashMovements.forEach((cashMovement) => {
      const date = new Date(cashMovement.date);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const key = `${month}-${year}`;

      if (xAxis.data.indexOf(key) === -1) {
        entrate[key] = 0;
        uscite[key] = 0;
        risparmi[key] = 0;
        xAxis.data.push(`${month}-${year}`);
      }

      if (cashMovement.amount > 0) {
        entrate[key] += cashMovement.amount;
      } else {
        uscite[key] += cashMovement.amount;
      }

      risparmi[key] = entrate[key] + uscite[key];
    });

    //sorting the data to better visualize it
    xAxis.data.sort((a, b) => {
      const aData = a.split('-');
      const bData = b.split('-');
      const aMonth = parseInt(aData[0], 10);
      const aYear = parseInt(aData[1], 10);
      const bMonth = parseInt(bData[0], 10);
      const bYear = parseInt(bData[1], 10);
      const aDate = new Date(aYear, aMonth - 1);
      const bDate = new Date(bYear, bMonth - 1);
      return aDate.getTime() - bDate.getTime();
    });

    const sortedEntrate = this.sortRecordByDateKey(entrate);
    const sortedUscite = this.sortRecordByDateKey(uscite);
    const sortedRisparmi = this.sortRecordByDateKey(risparmi);

    return {
      series: {
        entrate: Object.values(sortedEntrate),
        uscite: Object.values(sortedUscite),
        risparmi: Object.values(sortedRisparmi),
      },
      xAxis,
    };
  }

  private sortRecordByDateKey(record: Record<string, number>) {
    return Object.fromEntries(
      Object.entries(record).sort((a, b) => this.sortByDate(a, b))
    );
  }

  private sortByDate(a: any, b: any) {
    const aData = a[0].split('-');
    const bData = b[0].split('-');
    const aMonth = parseInt(aData[0], 10);
    const aYear = parseInt(aData[1], 10);
    const bMonth = parseInt(bData[0], 10);
    const bYear = parseInt(bData[1], 10);
    const aDate = new Date(aYear, aMonth - 1);
    const bDate = new Date(bYear, bMonth - 1);
    return aDate.getTime() - bDate.getTime();
  }

  private getCategoryGraphData(
    categories: Category[],
    cashMovements: CashMovement[]
  ) {
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
          value: totalAmount,
          name: category.name,
        };
      })
      .filter((data) => data.value !== 0)
      .sort((a, b) => a.value - b.value);
  }
}
