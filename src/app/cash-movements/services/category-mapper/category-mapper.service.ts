import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { CategoryRepositoryService } from 'src/app/categories/services/category-repository/category-repository.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryMapperService {
  constructor(private categoryRepository: CategoryRepositoryService) {}

  async getCategoryNames() : Promise<string[]> {
    return await firstValueFrom(
      this.categoryRepository
        .getAll()
        .pipe(map((categories) => categories.map((category) => category.name)))
    );
  }

  async getCategoryIdFromName(categoryName : string) : Promise<number> {
    const categories = await firstValueFrom(this.categoryRepository.getAll());
    const category = categories.find(category => category.name === categoryName);
    debugger;
    return category ? category.categoryId : 0;
  }

  async getNameFromCategoryId(categoryId : number) : Promise<string> {
    const categories = await firstValueFrom(this.categoryRepository.getAll());
    const category = categories.find(category => category.categoryId === categoryId);
    debugger;
    return category ? category.name : '';
  }
}
