import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CognitoUserPool, CognitoUserAttribute, ICognitoUserPoolData, ICognitoUserAttributeData } from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';


interface formDataInterface {
  "name": string;
  "email": string;
  [key: string]: string;
};

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  isLoading: boolean = false;
  hasFailedSignUp: boolean = false;
  hasSucceededSignUp: boolean = false;
  signUpStatusMessage: string = '';
  user = {
    name:  '',
    email:  '',
    password:  '',
  }
  


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateToSignIn(){
    this.router.navigateByUrl('/sign-in');
  }

  onSignup(form: NgForm) {
    
    if (form.valid) {
      this.isLoading = true;
      let poolData: ICognitoUserPoolData = {
        UserPoolId: environment.cognitoUserPoolId,
        ClientId: environment.cognitoAppClientId
      };
      
      let userPool = new CognitoUserPool(poolData);
      
      var attributeList: CognitoUserAttribute [] = [];
      let formData: formDataInterface = {
        "name": this.user.name,
        "email": this.user.email
      }

      for (let key in formData) {
        let attrData: CognitoUserAttribute = new CognitoUserAttribute({
          Name: key,
          Value: formData[key]
        });
        let attribute = new CognitoUserAttribute(attrData);
        attributeList.push(attrData);
      }      

      userPool.signUp(this.user.email, this.user.password, attributeList, [], (
        err,
        result
      ) => {
        this.isLoading = false;
        if (err) {
          // alert(err.message || JSON.stringify(err));
          this.hasSucceededSignUp = false;
          this.hasFailedSignUp = true;
          this.signUpStatusMessage = err.message
          return;
        }      
        this.hasSucceededSignUp = true;
        this.hasFailedSignUp = false;
        this.signUpStatusMessage = 'New user account is created. Please click on the verification link sent your email id.'

        // this.router.navigate(['/sign-in']);
      });

      // setTimeout(() => {console.log("this is the first message")}, 5000);
    } else {
      this.hasSucceededSignUp = false;
      this.hasFailedSignUp = true;
      this.signUpStatusMessage = "Please fill your details correctly and then click on submit."
    }

  }

}
