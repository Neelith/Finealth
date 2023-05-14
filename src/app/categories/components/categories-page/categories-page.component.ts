import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from 'src/app/generic/table/table.component';
import { PageTitleBarComponent } from 'src/app/page-title-bar/page-title-bar.component';
import { Category } from 'src/app/entities/model/category';
import { Observable, of } from 'rxjs';
import { CategoryRepositoryService } from '../../services/category-repository/category-repository.service';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule, TableComponent, PageTitleBarComponent],
  providers: [CategoryRepositoryService],
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss'],
})
export class CategoriesPageComponent {
  pageTitle: string = 'Categorie';
  categories$: Observable<Category[]> =
    this.categoryRepository.getAll();
  displayedColumns: string[] = ['categoryId', 'name', 'actions'];

  constructor(private categoryRepository: CategoryRepositoryService) {}

  showAddCategoryForm() {
    let category: Category = new Category();
    category.name = 'testone';

    this.categoryRepository.add(category).subscribe();

    this.categories$ = this.categoryRepository.getAll();
  }

  OnEditCategory(category: Category) {
    category.name = 'testoneModificato';
    this.categoryRepository.edit(category).subscribe();
    this.categories$ = this.categoryRepository.getAll();
  }

  OnDeleteCategory(category: Category) {
    this.categoryRepository.delete(category.categoryId).subscribe();
    this.categories$ = this.categoryRepository.getAll();
  }
}
