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
  imports: [CommonModule, PageTitleBarComponent, MaterialModule, CuFormComponent, GenericViewComponent],
  templateUrl: './simulation-page.component.html',
  styleUrls: ['./simulation-page.component.scss']
})
export class SimulationPageComponent {
  pageTitle: string = 'Simulatori';
  onlyNumbersRegex : string = "^[0-9]+(\.[0-9]+)?$";
  compoundFormControlDescriptors: FormControlDescriptor[] = [];
  detailsViewDescriptors : DetailViewDescriptor[] = [];
  showResultView : boolean = false;

constructor(){
  this.compoundFormControlDescriptors = [
    {
      formControlName: 'principal',
      formControl: new FormControl(0, [Validators.required, Validators.pattern(this.onlyNumbersRegex)]),
      hidden: false,
      label: 'Investimenti attuali',
      type: 'Text',
    },
    {
      formControlName: 'addition',
      formControl: new FormControl(0, [Validators.required, Validators.pattern(this.onlyNumbersRegex)]),
      hidden: false,
      label: 'Investimento annuale',
      type: 'Text',
    },
    {
      formControlName: 'yearsToGrow',
      formControl: new FormControl(25, [Validators.required, Validators.pattern(this.onlyNumbersRegex)]),
      hidden: false,
      label: 'Anni',
      type: 'Text',
    },
    {
      formControlName: 'interest',
      formControl: new FormControl(8, [Validators.required, Validators.pattern(this.onlyNumbersRegex)]),
      hidden: false,
      label: 'Interesse in %',
      type: 'Text',
    },
    {
      formControlName: 'capitalGainTax',
      formControl: new FormControl(26, [Validators.required, Validators.pattern(this.onlyNumbersRegex)]),
      hidden: false,
      label: 'Tasse sul capital gain in %',
      type: 'Text',
    },
    {
      formControlName: 'annualTax',
      formControl: new FormControl(0.2, [Validators.required, Validators.pattern(this.onlyNumbersRegex)]),
      hidden: false,
      label: 'Imposta di bollo (o IVAFE) %',
      type: 'Text',
    }
  ]
}
  calculate(form: FormGroup){
    //calc things
    const principal = form.value.principal;
    const addition = form.value.addition;
    const yearsToGrow = form.value.yearsToGrow;
    const interest = form.value.interest;
    const capitalGainTax = form.value.capitalGainTax;
    const annualTax = form.value.annualTax;

    const compoundInterest = this.calculateCompoundInterest(principal, addition, interest, yearsToGrow);

    this.detailsViewDescriptors = [
      {
        hidden: false,
        label: 'Montante lordo',
        value: compoundInterest,
        type: 'Currency',
      },
      {
        hidden: false,
        label: 'Montante netto',
        value: 666,
        type: 'Currency',
      },
    ];
    this.showResultView = true;
  }

  private calculateCompoundInterest(p: number, a: number, r: number, y: number): number {
    const n = 1; // Assuming interest is compounded annually
    const i = r/100;
    const principalFutureValue = p * (Math.pow((1 + i / n), y * n));
    const annualAdditionFutureValue = (a/i) * Math.pow((1+i), y) - a/i
    return annualAdditionFutureValue + principalFutureValue;
  }

}
