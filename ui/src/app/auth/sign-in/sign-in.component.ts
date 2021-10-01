import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  isLoading: boolean = false;
  email: string = '';
  password: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateToSignUp(){
    this.router.navigateByUrl('/sign-up');
  }

  onSignIn(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      let authenticationDetails = new AuthenticationDetails({
        Username: this.email,
        Password: this.password,
      });
      let poolData = {
        UserPoolId: environment.cognitoUserPoolId, // Your user pool id here
        ClientId: environment.cognitoAppClientId // Your client id here
      };

      let userPool = new CognitoUserPool(poolData);
      let userData = { Username: this.email, Pool: userPool };
      var cognitoUser = new CognitoUser(userData);
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {

          // console.log('access token + ' + result.getAccessToken().getJwtToken());
          // console.log('id token + ' + result.getIdToken().getJwtToken());
          // console.log('refresh token + ' + result.getRefreshToken().getToken());
          console.log(result.isValid());
          
          this.router.navigate(["home"])
        },
        onFailure: (err) => {
          alert(err.message || JSON.stringify(err));
          this.isLoading = false;
        },
      });
    }
  }


}
