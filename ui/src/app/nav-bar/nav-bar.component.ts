import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  showAuthNavBar(): boolean{
    let isAuth = this.authService.isLoggedIn();
    return !isAuth;
  }
  
  onLogout(): void {
    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };
    let userPool = new CognitoUserPool(poolData);
    let cognitoUser = userPool.getCurrentUser();
    console.log(cognitoUser?.getUsername());

    cognitoUser?.getSession((err: any, session: any) => {
      if (err) {
        console.log(err);
      } else if (!session.isValid()) {
        console.log("Invalid session.");
      } else {
        console.log("IdToken: " + session.getIdToken().getJwtToken());
      }
    });
    
    
    cognitoUser?.signOut();

    cognitoUser?.getSession((err: any, session: any) => {
      if (err) {
        console.log(err);
      } else if (!session.isValid()) {
        console.log("Invalid session.");
      } else {
        console.log("IdToken: " + session.getIdToken().getJwtToken());
      }
    });
    
    this.router.navigate(["sign-in"])
  }

}
