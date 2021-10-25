import { Injectable } from '@angular/core';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private poolData = {
    UserPoolId: environment.cognitoUserPoolId,
    ClientId: environment.cognitoAppClientId
  };

  constructor() { }

  isLoggedIn(): boolean {
    var isAuth = false;
    var userPool = new CognitoUserPool(this.poolData);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession((err: any, session: any) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
        }
        isAuth = session.isValid();
      })
    }
    return isAuth;
  }

  getAuthToken(): string {
    let authToken: string = "";
    console.log("this.isLoggedIn() ", this.isLoggedIn());
    var userPool = new CognitoUserPool(this.poolData);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession((err: any, session: any) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
        }
        else if (session.isValid()) {
          authToken = session.getIdToken().getJwtToken();
        }
      })
    }


    return authToken;
  }


}
