import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

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
  isLoading:boolean = false;
  fullname:string = '';
  email:string = '';
  password:string = '';
  confirmPassword:string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSignup(form: NgForm){
    if (form.valid) {
     this.isLoading = true;
    }
  }

}
