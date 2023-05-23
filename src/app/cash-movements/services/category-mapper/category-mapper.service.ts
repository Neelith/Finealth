import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { CategoryRepositoryService } from 'src/app/categories/services/category-repository/category-repository.service';
import { IconSelectOption } from 'src/app/entities/dto/IconSelectOption';
import { CashMovement } from 'src/app/entities/model/Cash-Movement';
import { Category } from 'src/app/entities/model/Category';

@Injectable({
  providedIn: 'root',
})
export class CategoryMapperService {
  constructor(private categoryRepository: CategoryRepositoryService) {}

  async getCategoryNames(): Promise<string[]> {
    return await firstValueFrom(
      this.categoryRepository
        .getAll()
        .pipe(map((categories) => categories.map((category) => category.name)))
    );
  }

  async getCategoryIdFromName(categoryName: string): Promise<number> {
    const categories = await firstValueFrom(this.categoryRepository.getAll());
    const category = categories.find(
      (category) => category.name === categoryName
    );
    return category ? category.categoryId : 0;
  }

  async getNameFromCategoryId(categoryId: number): Promise<string> {
    const categories = await firstValueFrom(this.categoryRepository.getAll());
    const category = categories.find(
      (category) => category.categoryId === categoryId
    );
    return category ? category.name : '';
  }

  async getIconUrlFromCategoryId(categoryId: number, categories : Category[]): Promise<string | undefined> {
    const category = categories.find(
      (category) => category.categoryId === categoryId
    );
    return category ? category.iconUrl : '';
  }

  async mapCashMovementIconUrls(movements : CashMovement[]){
    const categories = await firstValueFrom(this.categoryRepository.getAll());
    for (const movement of movements) {
      movement.iconUrl = await this.getIconUrlFromCategoryId(movement.categoryId, categories);
    }
  }

  async getIconSelectOptionsFromCategories(): Promise<
    IconSelectOption<number>[]
  > {
    const categories = await firstValueFrom(this.categoryRepository.getAll());

    let keyValues = [] as IconSelectOption<number>[];
    for (const category of categories) {
      keyValues.push({
        label: category.name,
        src: category.iconUrl,
        value: category.categoryId,
      });
    }

    return keyValues;
  }
}
