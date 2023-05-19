export class CashMovement {
  public cashMovementId!: number;
  public description: string = '';
  public date!: string;
  public amount: number = 0;
  public categoryId: number = 0;

  public constructor() {}
}
