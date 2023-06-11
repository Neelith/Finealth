import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleBarComponent } from 'src/app/page-title-bar/page-title-bar.component';
import { MaterialModule } from 'src/app/material/material.module';
import { CuFormComponent } from 'src/app/generic/cu-form/cu-form.component';
import { FormControlDescriptor } from 'src/app/entities/dto/FormControlDescriptor';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GenericViewComponent } from 'src/app/generic/generic-view/generic-view.component';
import { DetailViewDescriptor } from 'src/app/entities/dto/DetailViewDescriptor';

@Component({
  selector: 'app-simulation-page',
  standalone: true,
  imports: [
    CommonModule,
    PageTitleBarComponent,
    MaterialModule,
    CuFormComponent,
    GenericViewComponent,
  ],
  templateUrl: './simulation-page.component.html',
  styleUrls: ['./simulation-page.component.scss'],
})
export class SimulationPageComponent {
  pageTitle: string = 'Simulatori';
  onlyNumbersRegex: string = '^[0-9]+(.[0-9]+)?$';
  compoundFormControlDescriptors: FormControlDescriptor[] = [];
  detailsViewDescriptors: DetailViewDescriptor[] = [];
  showResultView: boolean = false;

  constructor() {
    this.compoundFormControlDescriptors = [
      {
        formControlName: 'principal',
        formControl: new FormControl(0, [
          Validators.required,
          Validators.pattern(this.onlyNumbersRegex),
        ]),
        hidden: false,
        label: 'Investimenti attuali',
        type: 'Text',
      },
      {
        formControlName: 'addition',
        formControl: new FormControl(0, [
          Validators.required,
          Validators.pattern(this.onlyNumbersRegex),
        ]),
        hidden: false,
        label: 'Investimento annuale',
        type: 'Text',
      },
      {
        formControlName: 'yearsToGrow',
        formControl: new FormControl(25, [
          Validators.required,
          Validators.pattern(this.onlyNumbersRegex),
        ]),
        hidden: false,
        label: 'Anni',
        type: 'Text',
      },
      {
        formControlName: 'interest',
        formControl: new FormControl(8, [
          Validators.required,
          Validators.pattern(this.onlyNumbersRegex),
        ]),
        hidden: false,
        label: 'Interesse in %',
        type: 'Text',
      },
      {
        formControlName: 'capitalGainTax',
        formControl: new FormControl(26, [
          Validators.required,
          Validators.pattern(this.onlyNumbersRegex),
        ]),
        hidden: false,
        label: 'Tasse sul capital gain in %',
        type: 'Text',
      },
      {
        formControlName: 'annualTax',
        formControl: new FormControl(0.2, [
          Validators.required,
          Validators.pattern(this.onlyNumbersRegex),
        ]),
        hidden: false,
        label: 'Imposta di bollo (o IVAFE) %',
        type: 'Text',
      },
      {
        formControlName: 'safeWithdrawRate',
        formControl: new FormControl(3.5, [
          Validators.required,
          Validators.pattern(this.onlyNumbersRegex),
        ]),
        hidden: false,
        label: 'Tasso di prelievo in %',
        type: 'Text',
      }
    ];
  }
  calculate(form: FormGroup) {
    const principal: number = +form.value.principal;
    const addition: number = +form.value.addition;
    const yearsToGrow: number = +form.value.yearsToGrow;
    const interest: number = +form.value.interest;
    const capitalGainTax: number = +form.value.capitalGainTax;
    const annualTax: number = +form.value.annualTax;
    const safeWithdrawRate : number = +form.value.safeWithdrawRate;

    if (principal === 0 && addition === 0) {
      return;
    }

    const compoundInterest = this.calculateCompoundInterest(
      principal,
      addition,
      interest,
      yearsToGrow,
      annualTax
    );
    const totalContribution: number = addition * yearsToGrow + principal;
    const totalInterest: number = compoundInterest - totalContribution;
    const netInterest: number = totalInterest <= 0? 0 :
      totalInterest - (totalInterest * capitalGainTax) / 100;
    const totalNet: number = totalInterest <= 0? compoundInterest : netInterest + totalContribution;
    const annualWithdraw : number = totalNet * safeWithdrawRate / 100;

    this.detailsViewDescriptors = [
      {
        hidden: false,
        label: 'Montante lordo',
        value: compoundInterest,
        type: 'Currency',
      },
      {
        hidden: false,
        label: 'Versamenti totali',
        value: totalContribution,
        type: 'Currency',
      },
      {
        hidden: false,
        label: 'Interessi totali',
        value: totalInterest,
        type: 'Currency',
      },
      {
        hidden: false,
        label: 'Interessi netti',
        value: netInterest,
        type: 'Currency',
      },
      {
        hidden: false,
        label: 'Montante netto',
        value: totalNet,
        type: 'Currency',
      },
      {
        hidden: false,
        label: 'Prelievo netto (annuo)',
        value: annualWithdraw,
        type: 'Currency',
      }
    ];
    this.showResultView = true;
  }

  private calculateCompoundInterest(
    p: number,
    a: number,
    r: number,
    y: number,
    annualTax : number
  ): number {
    const i = r / 100 - annualTax / 100;

    const compoundInterest = p * Math.pow(1 + i, y) + a *((Math.pow((1+i), y)-1) / (i));
    return compoundInterest;
  }
}
