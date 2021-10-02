import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './auth/auth-guard.guard';
import { AuthService } from './auth/auth.service';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AllExpensesPageComponent } from './main-nav-bar/all-expenses-page/all-expenses-page.component';
import { HomePageComponent } from './main-nav-bar/home-page/home-page.component';

const routes: Routes = [
  { path: 'home', component: HomePageComponent, canActivate : [AuthGuardGuard] },
  { path: 'all-expenses', component: AllExpensesPageComponent, canActivate : [AuthGuardGuard] },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthService]
})
export class AppRoutingModule { }
