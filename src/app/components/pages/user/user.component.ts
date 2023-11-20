import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { LoginResponse } from 'src/app/models/loginresponse.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { setLoginData } from 'src/app/store/auth/auth.actions';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  user?: User;
  previewImageUrl?: string;
  imageFile?: File;
  loginResponse?: LoginResponse;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private authStore: Store<{ auth: LoginResponse }>
  ) {
    this.authService.getLoggedInData().subscribe({
      next: (loginData) => {
        this.user = { ...loginData.user } as User;
        this.loginResponse = loginData;        
      },
    });
  }

  openUpdateModal(updateContent: any) {
    this.modalService.open(updateContent, {
      size: 'lg',
      centered: true,
      scrollable: true,
    });
  }

  formSubmitted(event: SubmitEvent): void {
    event.preventDefault();
    if (this.user) {
      if (this.user.password != this.user.confirmPassword) {
        this.toastrService.error(
          'Confirm Password and Password does not match!'
        );
        return;
      }

      if (this.user.name.trim() === '') {
        this.toastrService.error('Name Cannot be blank !');
      }
      //UPDATE USER

      this.userService.updateUser(this.user).subscribe({
        next: (updatedUser) => {
          console.log(updatedUser);

          const newLoginResponse = {
            jwtToken: this.loginResponse?.jwtToken,
            user: updatedUser,
            login: this.loginResponse?.login,
          };
          this.authStore.dispatch(
            setLoginData(newLoginResponse as LoginResponse)
          );
          this.toastrService.success('User Updated Successfully!');

          //call image update api if image is seleted
          //IMAGE UPLOAD
          if (this.imageFile) {
            this.userService
              .uploadUserImage(updatedUser.userId, this.imageFile)
              .subscribe({
                next: (data :any) => {
                  console.log(data);
                  console.log(updatedUser);
                  
                  
                  const newLoginResponse = {
                    jwtToken: this.loginResponse?.jwtToken,
                    user: {...updatedUser,imageName : data.imageName },
                    login: this.loginResponse?.login,
                  };


                  this.authStore.dispatch(
                    setLoginData(newLoginResponse as LoginResponse)
                  );
                  this.toastrService.success(data.message);
                  this.imageFile = undefined;
                  this.previewImageUrl = ''
                  console.log(data);
                  this.modalService.dismissAll();
                },
                error: (error) => {
                  console.log(error);
                  this.toastrService.error('Error in updating Image!');
                },
              });
          }
        },
        error: (error) => {
          this.toastrService.error('Error in Updating User!');
          this.toastrService.error(error.error);
          console.log(error);
        },
      });
    }
  }

  imageFieldChanged(event: Event) {
    this.imageFile = (event.target as HTMLInputElement).files![0];

    if (
      this.imageFile.type == 'image/png' ||
      this.imageFile.type == 'image/jpeg'
    ) {
      // preview file

      const reader = new FileReader();

      reader.onload = () => {
        this.previewImageUrl = reader.result as string;
      };
      reader.readAsDataURL(this.imageFile);

      //upload file
    } else {
      this.toastrService.error('Only JPEG or PNG allowed !');
      this.imageFile = undefined;
    }
  }
}
