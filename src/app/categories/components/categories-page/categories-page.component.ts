import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from 'src/app/generic/table/table.component';
import { PageTitleBarComponent } from 'src/app/page-title-bar/page-title-bar.component';
import { Category } from 'src/app/entities/model/category';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule, TableComponent, PageTitleBarComponent],
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss']
})

export class CategoriesPageComponent {
  pageTitle : string = "Categorie";
  categories : Category[] = [
    {categoryId : 1, name: 'categoria1', iconUrl: ''},
    {categoryId : 2, name: 'categoria2', iconUrl: ''},
    {categoryId : 3, name: 'categoria3', iconUrl: ''},
    {categoryId : 4, name: 'categoria4', iconUrl: ''},
    {categoryId : 5, name: 'categoria5', iconUrl: ''},
  ]
  categories$ : Observable<Category[]> = of(this.categories);
  displayedColumns : string[] = ['entityImg','categoryId', 'name', 'actions'];

  OnEditCategory(category : Category){
    console.log(category);
  }

  OnDeleteCategory(category : Category){
    console.log(category);
  }
}
