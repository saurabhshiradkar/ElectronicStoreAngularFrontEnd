import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent {

  constructor(private toastr:ToastrService, private categoryService: CategoryService){}

  category : Category = new Category('','','','');


  formSubmitted(event : SubmitEvent, categoryForm : NgForm){
    event.preventDefault();
    // console.log(this.category);
    if(this.category.title.trim() === ''){
      this.toastr.warning('Title is required!');
      return;
    }
    if(this.category.description.trim() === ''){
      this.toastr.warning('Description is required!');
      return;
    }
    if(this.category.coverImage.trim() === ''){
      this.toastr.warning('Image URL is required!');
      return;
    }

    //submit form logic
    this.categoryService.createCategory(this.category).subscribe({
      next:(data)=> {
        // console.log('Category Added!');
        this.toastr.success("Category Added!")
        this.category = new Category('','','','');
        categoryForm.resetForm();
      },
      error:(error:HttpErrorResponse)=>{
        console.log(error);
        // Error
        let errorMessage = 'Oops! Something went wrong!';

        this.toastr.warning(error.error.title);
        console.log(error);
    
      },
      complete:()=>{
        //complete
      }
    })
  }

  resetForm(categoryForm : NgForm){
    categoryForm.resetForm();
    this.category = new Category('','','','');
  }
}
