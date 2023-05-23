import { EntityView } from "../dto/EntityView";

export class Category extends EntityView{
  public categoryId! : number;
  public name : string = '';

  constructor(){
    super();
  }
}
