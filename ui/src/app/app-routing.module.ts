import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './auth/auth-guard.guard';
import { AuthService } from './auth/auth.service';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AllExpensesPageComponent } from './expense-tracker/all-expenses-page/all-expenses-page.component';
import { HomePageComponent } from './expense-tracker/home-page/home-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [  
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  
  { path: 'all-expenses', component: AllExpensesPageComponent, canActivate : [AuthGuardGuard] },
  { path: 'home',  redirectTo: '/' },
  { path: '', component: HomePageComponent, canActivate : [AuthGuardGuard] },

  {path: '404', component: PageNotFoundComponent, canActivate : [AuthGuardGuard]},
  {path: '**', redirectTo: '/404' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthService]
})
export class AppRoutingModule { }
