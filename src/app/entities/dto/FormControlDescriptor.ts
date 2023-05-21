import { KeyValue } from "@angular/common";
import { NgIterable } from "@angular/core";
import { FormControl } from "@angular/forms";
import { IconSelectOption } from "./IconSelectOption";

export interface FormControlDescriptor
{
  formControlName : string;
  formControl : FormControl;
  hidden : boolean;
  label : string;
  type: 'Text' | 'Date' | 'Select' | 'IconSelect';
  selectOptions? : string[] | null;
  iconSelectOptions? : IconSelectOption<any>[] | null;
}
