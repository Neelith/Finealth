export interface TableColumnDescriptor {
  field: string;
  header: string;
  type: 'text' | 'date' | 'number' | 'actions' | 'currency' | 'icon';
  currencySymbol? : string;
  dateFormat? : string;
  imgSrc? : string;
}
