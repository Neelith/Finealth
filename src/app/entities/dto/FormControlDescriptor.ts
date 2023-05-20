import { FormControl } from "@angular/forms";

export interface FormControlDescriptor
{
  formControlName : string;
  formControl : FormControl;
  hidden : boolean;
  label : string;
  type: 'Text' | 'Date' | 'IconSelect';
  selectOptions? : string[] | null;
}
