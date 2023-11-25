import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { Product, ProductWithOutCategory } from 'src/app/models/product.model';
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
  productWithOutCategory: ProductWithOutCategory = new ProductWithOutCategory();

  imageData: ImageData = {
    previewImageUrl: '',
    file: undefined,
  }


  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private toastrService: ToastrService,
    private catStore: Store<{ cat: Category[] }>,
  ) { }


  ngOnInit(): void {

    //loading categories
    
    this.catStore.select('cat').subscribe({

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
    // productForm.form.markAllAsTouched();

    // Handle form submission logic here
    event.preventDefault();

    //VALIDATE DATA
    
    if (productForm.form.invalid) {
      this.toastrService.error('Please Fill the form correctly!');
      return;
    }
    if (this.product.title.trim() === '') {
      this.toastrService.error('Title is Required !');
      return;
    }
    if (this.product.description==null ||  this.product.description.trim() === '') {
      this.toastrService.error('Description is Required !');
      return;
    }
    const numericQuantity = parseFloat(this.product.quantity + '');
    if (isNaN(numericQuantity) || numericQuantity <= 0) {
      this.toastrService.error('Quantity must be greater than Zero(0)!');
      return;
    }
    
    const numericProductPrice = parseFloat(this.product.price + '');
    if (isNaN(numericProductPrice) || numericProductPrice <= 0) {
      this.toastrService.error('Please provide a correct numeric product price!');
      return;
    }
    const numericDiscountedPrice = parseFloat(this.product.discountedPrice +'');
    if (isNaN(numericDiscountedPrice) || 
      numericDiscountedPrice <= 0 ||
      numericDiscountedPrice >
      numericProductPrice
    ) {
      this.toastrService.error('Discounted Price should be less than or equal to product price !');
      return;
    }


    // Check if a category is selected
    if (this.product.category.categoryId == '') {
      // add product without category
    // Create a copy of this.product without the category information
    const productWithoutCategory: ProductWithOutCategory = {
      productId: this.product.productId,
      title: this.product.title,
      description: this.product.description,
      quantity: this.product.quantity,
      price: this.product.price,
      discountedPrice: this.product.discountedPrice,
      live: this.product.live,
      stock: this.product.stock,
      productImageName: this.product.productImageName,
    };

    console.log(productWithoutCategory);

      this.productService.createProduct(productWithoutCategory)
        .subscribe({
          next: (createdProduct) => {
            console.log(createdProduct);
            this.toastrService.success(`Added New Product without category !`);
            //Image Upload 
            this.productService.uploadProductImage(createdProduct.productId, this.imageData.file!).subscribe({
              next: (imageUploadData) => {
                console.log(imageUploadData);

              },
              error: (error) => {
                console.log(error);
              }
            });
            productForm.resetForm();
            this.resetImage();
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
            this.toastrService.success(`Added New Product in ${createdProduct.category.title} category !`);

            //Image Upload 
            this.productService.uploadProductImage(createdProduct.productId, this.imageData.file!).subscribe({
              next: (imageUploadData) => {
                console.log(imageUploadData);
              },
              error: (error) => {
                console.log(error);
              }
            });

            productForm.resetForm();
            this.resetImage();
          },
          error: (error) => {
            console.log(error);
          }
        });
    }


  }

  imageFieldChanged(event: Event) {
    console.log(event);
    this.imageData.file = (event.target as HTMLInputElement).files![0]
    console.log(this.imageData.file);
    if ((this.imageData.file.type == "image/png") || (this.imageData.file.type == "image/jpeg")) {
      // preview file

      const reader = new FileReader()

      reader.onload = () => {
        this.imageData.previewImageUrl = reader.result as string;
      }
      reader.readAsDataURL(this.imageData.file)


      //upload file 
    }
    else {
      this.toastrService.error("Only JPEG or PNG allowed !");
      this.imageData.file = undefined;
      this.imageData.previewImageUrl = '';
      this.product.productImageName = ''

    }
  }

  resetImage() {
    this.imageData.file = undefined;
    this.imageData.previewImageUrl = '';
    this.product.productImageName = ''
  }

  resetForm(productForm: NgForm) {
    productForm.resetForm();
    this.product = new Product();
  }

  compareFn(value: any, option: any) {
    return value?.categoryId === option?.categoryId;
  }

}

export interface ImageData { previewImageUrl: string, file: File | undefined }