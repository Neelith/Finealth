import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { FormControlDescriptor } from 'src/app/entities/dto/FormControlDescriptor';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-cu-form',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './cu-form.component.html',
  styleUrls: ['./cu-form.component.scss']
})
export class CuFormComponent {
  @Input() formControlDescriptors: FormControlDescriptor[] = [];
  @Input() iconUrls?: string[];
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

  onCancelFormEvent(){
    this.cancelFormEvent.emit();
  }

  getIconLabel(iconUrl: string): string {
    const lastSlashIndex = iconUrl.lastIndexOf('/');
    const lastDotIndex = iconUrl.lastIndexOf('.');
    let iconLabel = iconUrl.slice(lastSlashIndex + 1, lastDotIndex);

    // Replace all '-' and '_' characters with a whitespace
    iconLabel = iconLabel.replace(/[-_]/g, ' ');

    // Remove the word 'icon' from the label
    iconLabel = iconLabel.replace(/icons8/g, '');
    iconLabel = iconLabel.replace(/icon/g, '');
    iconLabel = iconLabel.replace(/64/g, '');

    return iconLabel;
  }
}
