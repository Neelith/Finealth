import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesPageComponent } from './categories/components/categories-page/categories-page.component';
import { CashMovementsPageComponent } from './cash-movements/components/cash-movements-page/cash-movements-page.component';

const routes: Routes = [
  { path: 'movements', component: CashMovementsPageComponent },
  { path: 'categories', component: CategoriesPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
