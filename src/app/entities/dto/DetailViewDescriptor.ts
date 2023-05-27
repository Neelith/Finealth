export interface DetailViewDescriptor{
  hidden : boolean;
  label : string;
  value : any;
  type: 'Text' | 'Date' | 'Currency';
  currencySymbol? : string;
  dateFormat? : string;
}
