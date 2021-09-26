import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllExpensesPageComponent } from './all-expenses-page/all-expenses-page.component';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'all-expenses', component: AllExpensesPageComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
