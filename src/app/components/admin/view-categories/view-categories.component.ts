import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { setCategoryData } from 'src/app/store/category/category.actions';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-categories',
  templateUrl: './view-categories.component.html',
  styleUrls: ['./view-categories.component.css']
})
export class ViewCategoriesComponent implements OnInit {

  categories: Category[] = [];
  closeResult = '';
  selectedCategory?: Category;

  updateView = false;

  constructor(
    private categoryService: CategoryService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private catStore: Store<{ cat: Category[] }>,
  ) { }

  ngOnInit(): void {
    this.catStore.select('cat').subscribe({
      next: (categories) => {
        if (this.categories.length > 0) {
          // console.log('Categories already there...');
          this.categories = categories;
        }
        else {
          // console.log('No Categories.... Loading from Server');
          this.categoryService.getCategories().subscribe({
            next: (categories) => {
              // Update categoryCoverImage for each category
              this.categories = categories.content.map(category => {
                if (!category.coverImage.includes('http') && !category.coverImage.startsWith('data')) {
                  category.coverImage = `${environment.apiUrl}/categories/image/${category.categoryId}`;
                }
                return category;
              });
              this.catStore.dispatch(setCategoryData({ categories: this.categories }))
            }
          });
        }

      }
    });
  }





  open(content: any, category: Category) {
    this.selectedCategory = { ...category },
      this.modalService.open(
        content,
        {
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true,

        }).result.then((result) => {
          // console.log(result);

        }).catch((error) => {
          // console.log(error);

        }).finally(() => {
          // console.log("Model Closed");
          this.updateView = false;
        });
  }


  deleteCategory(categoryToBeDeleted?: Category) {

    this.categoryService.deleteCategory(categoryToBeDeleted!.categoryId).subscribe({
      next: (data) => {
        // console.log(data);
        this.toastr.success('Category Deleted!');
        this.categories = this.categories.filter(cat => cat.categoryId != this.selectedCategory?.categoryId);
        this.modalService.dismissAll();
      },

      error: (error) => {
        console.log(error);
        this.toastr.error('Error In Deleting Category !');
        this.modalService.dismissAll();
      }
    });
    // console.log('DELETE CATEGORY WORKING ');
    
    // console.log(categoryToBeDeleted);
  }

  updateCategory() {
    this.categoryService.updateCategory(this.selectedCategory!).subscribe({
      next: (updatedCategory) => {
        console.log(updatedCategory);
        
        // this.categories = this.categories.map(cat => {
        //   if (cat.categoryId === this.selectedCategory?.categoryId) {
        //     cat.title = this.selectedCategory.title;
        //     cat.description = this.selectedCategory.description;
        //     cat.coverImage = this.selectedCategory.coverImage;
        //     return cat;
        //   }
        //   return cat;
        // }

        this.categories = this.categories.map(cat => {
          if (cat.categoryId === this.selectedCategory?.categoryId) {
            return {
              ...cat,
              title: this.selectedCategory.title,
              description: this.selectedCategory.description,
              coverImage: this.selectedCategory.coverImage
            };
          }
          return cat;
        }

        );
        this.modalService.dismissAll();
        this.toastr.success("Category Updated");
      },
      error: (error) => {
        console.log(error);
        this.toastr.error("Error In Updating Category !");
        this.modalService.dismissAll();
      }
    })
  }




  toggleUpdateView() {
    this.updateView = !this.updateView;
  }


  formSubmitted(event: SubmitEvent, categoryForm: NgForm) {

  }

  resetForm(categoryForm: NgForm) {

  }

  yesDelete(){
    console.log('Delete Working');
  }

}
