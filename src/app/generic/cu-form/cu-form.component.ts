import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, KeyValue } from '@angular/common';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { FormControlDescriptor } from 'src/app/entities/dto/FormControlDescriptor';
import { MaterialModule } from 'src/app/material/material.module';
import { IconSelectOption } from 'src/app/entities/dto/IconSelectOption';

@Component({
  selector: 'app-cu-form',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './cu-form.component.html',
  styleUrls: ['./cu-form.component.scss'],
})
export class CuFormComponent {
  @Input() formControlDescriptors: FormControlDescriptor[] = [];
  @Input() submitButtonText: string = 'Submit';
  @Input() cancelButtonText: string = 'Cancella';
  @Output() submitFormEvent = new EventEmitter<FormGroup>();
  @Output() cancelFormEvent = new EventEmitter<void>();
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const formControlsConfig: { [key: string]: AbstractControl } = {};
    for (const formControlDescriptor of this.formControlDescriptors) {
      formControlsConfig[formControlDescriptor.formControlName] =
        formControlDescriptor.formControl;
    }
    this.form = this.fb.group(formControlsConfig);
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

  getIconSelectOptionKeys(
    options: IconSelectOption<any>[] | null | undefined
  ) {
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
    return options?.find((option) => option.label === selectedOptionLabel)?.value;
  }
}
