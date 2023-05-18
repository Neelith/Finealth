import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { FormControlDescriptor } from 'src/app/entities/dto/FormControlDescriptor';

@Component({
  selector: 'app-edit-form',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss']
})
export class EditFormComponent {
  @Input() editFormEnabled : boolean = true;
  @Input() selectIconEnabled : boolean = false;
  @Input() formControlDescriptors: FormControlDescriptor[] = [];
  @Input() iconUrls?: string[];

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    debugger;
    const formControlsConfig: { [key: string]: AbstractControl } = {};
    for (const formControlDescriptor of this.formControlDescriptors) {
      formControlsConfig[formControlDescriptor.formControlName] = formControlDescriptor.formControl;
    }
    this.form = this.fb.group(formControlsConfig);

  }

  getIconLabel(icon: string): string {
    // TODO: Implement logic to get label from icon URL
    return icon;
  }
}
