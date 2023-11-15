import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  constructor(private toastr : ToastrService,private userService : UserService){}

  user = new User('','','','','male','');
  loading = false;

  formSubmit(event : SubmitEvent,signupForm : NgForm){
    event.preventDefault();
    // console.log(event);
    // console.log(this.user);
    // console.log(signupForm);

    if(signupForm.valid){
      //submit the form 
      this.loading=true;
      this.userService.signupUser(this.user)
      .subscribe({
        next:(user) => {
          //success
          this.toastr.success("Signup Successfull!");
          console.log(user);
          this.user = new User('','','','','male','');
          signupForm.resetForm();
        },
        error:(error:HttpErrorResponse)=>{
            // Error
            let errorMessage = 'Oops! Something went wrong!';
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            }
            this.toastr.error(errorMessage);
            console.log(error);
            this.loading=false;
          
        },
        complete:()=>{
          //complete
          this.loading=false;
        }
      });

      // console.log(this.user);
      
    }
    else
    {
      this.toastr.warning('Form is not valid !','Check Details Carefully !',
        {
          positionClass: 'toast-top-right'
        }
      )
    }
  }


  resetForm(signupForm : NgForm){
    signupForm.resetForm();
    this.user = new User('','','','','male','');
  }


}
