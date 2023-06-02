import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule, KeyValue } from '@angular/common';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { FormControlDescriptor } from 'src/app/entities/dto/FormControlDescriptor';
import { MaterialModule } from 'src/app/material/material.module';
import { IconSelectOption } from 'src/app/entities/dto/IconSelectOption';
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cu-form',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './cu-form.component.html',
  styleUrls: ['./cu-form.component.scss'],
})
export class CuFormComponent implements OnInit, OnDestroy {
  @Input() formControlDescriptors: FormControlDescriptor[] = [];
  @Input() submitButtonText: string = 'CONFERMA';
  @Input() cancelButtonText: string = 'CANCELLA';
  @Output() submitFormEvent = new EventEmitter<FormGroup>();
  @Output() cancelFormEvent = new EventEmitter<void>();

  subscription : Subscription = new Subscription();
  isScreenMoreThanSmall: boolean = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver
  ) {
    this.subscription.add(
      this.breakpointObserver
        .observe([
          Breakpoints.XSmall
        ])
        .subscribe((result: BreakpointState) => {
          if (!result.breakpoints[Breakpoints.XSmall]) {
            this.isScreenMoreThanSmall = true;
          }
        })
    );
  }

  ngOnInit(): void {
    const formControlsConfig: { [key: string]: AbstractControl } = {};
    for (const formControlDescriptor of this.formControlDescriptors) {
      formControlsConfig[formControlDescriptor.formControlName] =
        formControlDescriptor.formControl;
    }
    this.form = this.fb.group(formControlsConfig);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmitFormEvent() {
    for (const formControlDescriptor of this.formControlDescriptors) {
      this.form.controls[formControlDescriptor.formControlName].enable();
    }

    this.submitFormEvent.emit(this.form);
  }

  onCancelFormEvent() {
    this.cancelFormEvent.emit();
  }

  getIconSelectOptionKeys(options: IconSelectOption<any>[] | null | undefined) {
    if (Array.isArray(options)) return options.map((option) => option.label);

    return null;
  }

  getSrcFromOptions(
    options: IconSelectOption<any>[] | null | undefined,
    selectedOptionLabel: string
  ) {
    return options?.find((option) => option.label === selectedOptionLabel)?.src;
  }

  getValueFromOptions(
    options: IconSelectOption<any>[] | null | undefined,
    selectedOptionLabel: string
  ) {
    return options?.find((option) => option.label === selectedOptionLabel)
      ?.value;
  }
}
