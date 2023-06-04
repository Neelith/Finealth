import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesPageComponent } from './categories/components/categories-page/categories-page.component';
import { CashMovementsPageComponent } from './cash-movements/components/cash-movements-page/cash-movements-page.component';
import { DashboardPageComponent } from './dashboard/components/dashboard-page/dashboard-page.component';
import { SimulationPageComponent } from './simulation/components/simulation-page/simulation-page.component';

const routes: Routes = [
  { path: 'movements', component: CashMovementsPageComponent },
  { path: 'categories', component: CategoriesPageComponent },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'simulation', component: SimulationPageComponent },
  { path: '',  component: CashMovementsPageComponent  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
