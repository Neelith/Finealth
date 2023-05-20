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
}
