import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { Product } from 'src/app/models/product.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { setCategoryData } from 'src/app/store/category/category.actions';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  categories: Category[] = [];

  product: Product = new Product();


  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private toastrService: ToastrService,
    private catStore: Store<{ cat: Category[] }>,
  ) { }


  ngOnInit(): void {
    this.catStore.select('cat').pipe(take(1)).subscribe({
      next: (categories) => {
        if (categories.length > 0) {
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



  onSubmit(event: SubmitEvent, productForm: NgForm) {
    // Mark the form as touched to trigger validation messages
    productForm.form.markAllAsTouched();

    // Handle form submission logic here
    event.preventDefault();

    // validate data
    if (productForm.form.invalid) {
      this.toastrService.error('Please Fill the form correctly!');
      return;
    }
    if (this.product.title.trim() === '') {
      this.toastrService.error('Title is Required !');
      return;
    }
    if (this.product.description.trim() === '') {
      this.toastrService.error('Description is Required !');
      return;
    }
    if (this.product.quantity <= 0) {
      this.toastrService.error('Quantity must be greater than Zero(0)!');
      return;
    }
    if (this.product.price <= 0) {
      this.toastrService.error('Provide Correct Product Price !');
      return;
    }
    if (
      this.product.discountedPrice <= 0 ||
      this.product.discountedPrice > this.product.price
    ) {
      this.toastrService.error('Discounted Price should be less than or equal to product price !');
      return;
    }


    // Check if a category is selected
    if (this.product.category.categoryId == '') {
      // add product without category
      this.productService.createProduct(this.product)
        .subscribe({
          next: (createdProduct) => {
            console.log(createdProduct);
            this.toastrService.success(`Added New Product without category !`);
            productForm.resetForm();
          },
          error: (error) => {
            console.log(error);
          }
        });
    } else {
      // add product with category
      this.productService.createProductWithCategory(this.product)
        .subscribe({
          next: (createdProduct) => {
            console.log(createdProduct);
            this.toastrService.success(`Added New Product in ${this.product.category.title} category !`);
            productForm.resetForm();
          },
          error: (error) => {
            console.log(error);
          }
        });
    }


  }

  resetForm(productForm: NgForm) {
    productForm.resetForm();
    this.product = new Product();
  }

  compareFn(value: any, option: any) {
    return value?.categoryId === option?.categoryId;
  }

}
