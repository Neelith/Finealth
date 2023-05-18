import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from 'src/app/generic/table/table.component';
import { PageTitleBarComponent } from 'src/app/page-title-bar/page-title-bar.component';
import { Category } from 'src/app/entities/model/category';
import { Observable, of } from 'rxjs';
import { CategoryRepositoryService } from '../../services/category-repository/category-repository.service';
import { EditFormComponent } from '../../../generic/edit-form/edit-form.component';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormControlDescriptor } from 'src/app/entities/dto/FormControlDescriptor';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  providers: [CategoryRepositoryService],
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss'],
  imports: [
    CommonModule,
    TableComponent,
    PageTitleBarComponent,
    EditFormComponent,
  ],
})
export class CategoriesPageComponent {
  pageTitle: string = 'Categorie';
  categories$: Observable<Category[]> = this.categoryRepository.getAll();
  displayedColumns: string[] = ['categoryId', 'name', 'actions'];
  editFormControlDescriptors: FormControlDescriptor[] = [];
  editFormEnabled: boolean = false;

  constructor(
    private categoryRepository: CategoryRepositoryService,
    private formBuilder: FormBuilder
  ) {}

  showAddCategoryForm() {
    let category: Category = new Category();
    category.name = 'testone';

    this.categoryRepository.add(category).subscribe();

    this.categories$ = this.categoryRepository.getAll();
  }

  OnEditCategory(category: Category) {
    this.editFormControlDescriptors = [
      {
        formControlName: 'categoryId',
        formControl: new FormControl({
          value: category.categoryId,
          disabled: true,
        }),
      },
      {
        formControlName: 'categoryName',
        formControl: new FormControl(category.name, [
          Validators.required,
          Validators.maxLength(100),
        ]),
      },
      {
        formControlName: 'categoryIconUrl',
        formControl: new FormControl(category.iconUrl, [Validators.required]),
      },
    ];

    this.editFormEnabled = true;

    // this.categoryRepository.edit(category).subscribe();
    // this.categories$ = this.categoryRepository.getAll();
  }

  OnDeleteCategory(category: Category) {
    this.categoryRepository.delete(category.categoryId).subscribe();
    this.categories$ = this.categoryRepository.getAll();
  }
}
