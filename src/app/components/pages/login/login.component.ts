import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { LoginResponse } from 'src/app/models/loginresponse.model';
import { AuthService } from 'src/app/services/auth.service';
import { setLoginData } from 'src/app/store/auth/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  
  loginData = {
    email: '',
    password : '',
  };


  constructor(
    private toastr : ToastrService, 
    private authService: AuthService,
    private store : Store<{auth : LoginResponse}>,
    private router : Router
    ){
      // this.store.select('auth').subscribe({
      //   next:(data) => {
      //     console.log(data);
      //   },
      // });
    }

  formSubmitted(event : SubmitEvent){
    event.preventDefault();
    // console.log(this.loginData);

    if(
        this.loginData.email.trim()==='' || 
        this.loginData.password.trim()===''
      )
      {
        this.toastr.warning("Values Required !");
        return;
      }

    //call login api
    this.authService.generateToken(this.loginData)
    .subscribe({
      next:(value:LoginResponse) => {
        // console.log("USER LOGGED IN SUCCESSFULLY USER NAME :- "+value.user?.email);
        this.store.dispatch(setLoginData(value));
        this.router.navigate(['/user']);     
      },
      error:(error : HttpErrorResponse)=>{
        const errorMessage = error.error.message;
        console.log(`Error Message: ${errorMessage}`);
        
        // Show toastr message
        this.toastr.error(errorMessage);
      },
      complete:()=>{
        this.toastr.success('Login Successfull !')
      }
    });
  }

  resetForm(loginForm : NgForm){
    loginForm.resetForm();
    this.loginData.email='',
    this.loginData.password=''
  }
}
