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
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';


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
        "name": this.name,
        "email": this.email
      }

      for (let key in formData) {
        let attrData: CognitoUserAttribute = new CognitoUserAttribute({
          Name: key,
          Value: formData[key]
        });
        let attribute = new CognitoUserAttribute(attrData);
        attributeList.push(attrData);
      }      

      // userPool.signUp(this.email, this.password, attributeList, [], (
      //   err,
      //   result
      // ) => {
      //   this.isLoading = false;
      //   if (err) {
      //     alert(err.message || JSON.stringify(err));
      //     return;
      //   }      
      //   this.router.navigate(['/sign-in']);
      // });

      setTimeout(() => {console.log("this is the first message")}, 5000);
    }
  }

}
