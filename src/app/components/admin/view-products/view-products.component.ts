import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/category.model';
import { Product, ProductsResponse } from 'src/app/models/product.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { setCategoryData } from 'src/app/store/category/category.actions';
import { ImageData } from '../add-product/add-product.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css'],
})
export class ViewProductsComponent implements OnInit {
  productsResponse?: ProductsResponse;
  oldProductsResponse?: ProductsResponse;
  product: Product = new Product();
  updatedProductFromDb?: Product;
  update = false;
  categories: Category[] = [];
  defaultImagePath = 'assets/images/default.png';
  imageData: ImageData = {
    previewImageUrl: '',
    file: undefined,
  };
  searchQuery = '';
  searchMode = false;

  constructor(
    private productService: ProductService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private catStore: Store<{ cat: Category[] }>
  ) {}
  ngOnInit(): void {
    this.loadProducts(0);
  }

  loadProducts(pageNumber = 0) {
    this.productService
      .getAllProducts(pageNumber, 10, 'addedDate', 'desc')
      .subscribe({
        next: (productResponse) => {
          this.productsResponse = {
            ...productResponse,
            content: productResponse.content.map((product) => {
              if (
                !product.productImageName.includes('http') &&
                !product.productImageName.startsWith('data')
              ) {
                product.productImageName = `${environment.apiUrl}/products/image/${product.productId}`;
              }
              return product;
            }),
          };
          console.log(this.productsResponse);
        },
      });
  }

  open(content: any, product: Product) {
    const modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    modalRef.result.then(
      // Handle modal close (when resolved)
      () => {
        this.update = false;
      },
      // Handle modal dismiss (when rejected)
      () => {
        this.update = false;
      }
    );

    this.product = product;
  }

  yesDelete(event: any, product: Product) {
    if (event) {
      //delete product
      this.productService.deleteProduct(product.productId).subscribe({
        next: (response: any) => {
          this.toastrService.success(response.message);
          console.log(response);
          if (this.productsResponse) {
            this.productsResponse.content =
              this.productsResponse.content.filter(
                (p) => p.productId !== product.productId
              );
          }
        },

        error: (error) => {
          console.log(error);
          this.toastrService.error('Error in deleting Product!');
        },
      });
    }
  }

  loadCategories() {
    this.categoryService.getCategoriesFromStore().subscribe({
      next: (categories) => {
        if (categories.length > 0) {
          //
          this.categories = categories;
        } else {
          // load the data from server
          this.categoryService.getCategories().subscribe({
            next: (categoryResponse) => {
              this.catStore.dispatch(
                setCategoryData({ categories: categoryResponse.content })
              );
            },
          });
        }
      },
    });
  }

  toggleUpdateView(content: any, product: Product) {
    this.update = true;
    this.product = product;
    const modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    modalRef.result.then(
      // Handle modal close (when resolved)
      () => {
        this.update = false;
      },
      // Handle modal dismiss (when rejected)
      () => {
        this.update = false;
      }
    );

    //loading categories from store or backend
    this.loadCategories();
  }

  toggleUpdateView1() {
    this.update = !this.update;
    this.loadCategories();
  }

  updateFormSubmitted(event: SubmitEvent, productForm: NgForm) {
    // Mark the form as touched to trigger validation messages
    productForm.form.markAllAsTouched();

    // Handle form submission logic here
    event.preventDefault();

    // validate data
    if (this.product != null) {
      if (productForm.form.invalid) {
        this.toastrService.error('Please Fill the form correctly!');
        return;
      }
      if (this.product.title.trim() === '') {
        this.toastrService.error('Title is Required !');
        return;
      }
      if (
        this.product.description == null ||
        this.product.description.trim() === ''
      ) {
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
        this.toastrService.error(
          'Please provide a correct numeric product price!'
        );
        return;
      }
      const numericDiscountedPrice = parseFloat(
        this.product.discountedPrice + ''
      );
      if (
        isNaN(numericDiscountedPrice) ||
        numericDiscountedPrice <= 0 ||
        numericDiscountedPrice > numericProductPrice
      ) {
        this.toastrService.error(
          'Discounted Price should be less than or equal to product price !'
        );
        return;
      }

      console.log('Submitt form to Update');

      if (this.imageData.file == undefined && this.product) {
        this.productService.getProduct(this.product?.productId).subscribe({
          next: (productFromDb) => {
            this.product.productImageName = productFromDb.productImageName;
            console.log(
              'PRODUCT IMAGE NAME :- ' + this.product.productImageName
            );

            this.productService.updateProduct(this.product).subscribe({
              next: (updatedProduct) => {
                this.toastrService.success('Product Updated');
                this.loadProducts();
                console.log(updatedProduct);
                this.product = updatedProduct;
              },
              error: (error) => {
                this.toastrService.error(error.message);
                console.log(error);
              },
            });

            this.loadProducts();
          },
        });
      } else {
        this.productService.updateProduct(this.product).subscribe({
          next: (updatedProduct) => {
            this.toastrService.success('Product Updated');
            this.loadProducts();
            console.log(updatedProduct);
            this.product = updatedProduct;
          },
          error: (error) => {
            this.toastrService.error(error.message);
            console.log(error);
          },
        });
      }
    }
  }

  updateProductCategory() {
    console.log('updating category');

    // if (this.imageData.file == undefined && this.product) {
      // this.productService.getProduct(this.product?.productId).subscribe({
      //   next: (productFromDb) => {
      //     this.product.productImageName = productFromDb.productImageName;
      //     console.log(
      //       'PRODUCT IMAGE NAME :- ' + this.product.productImageName
      //     );
    

    if (this.product) {

      this.productService.getProduct(this.product?.productId).subscribe({
        next: (productFromDb) => {
          this.product.productImageName = productFromDb.productImageName;
          console.log(
            'PRODUCT IMAGE NAME :- ' + this.product.productImageName);
          },
        });
          
      this.productService
        .updateCategoryOfProduct(
          this.product?.productId,
          this.product?.category.categoryId
        )
        .subscribe({
          next: (data) => {
            this.product = data;
            this.toastrService.success('category updated !!');
          },
        });
    }
  }

  updateProductImage(productId: string, imageData: File) {
    console.log('updating image');

    if (this.imageData.file !== undefined && this.product) {
      //Image Upload
      this.productService.uploadProductImage(productId, imageData).subscribe({
        next: (imageUploadData) => {
          console.log('IMAGE UPLOADED');
          console.log(imageUploadData);
          this.toastrService.success('Image Updated !');
          this.loadProducts();
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  imageFieldChanged(event: Event) {
    console.log(event);
    this.imageData.file = (event.target as HTMLInputElement).files![0];
    console.log(this.imageData.file);
    if (
      this.imageData.file.type == 'image/png' ||
      this.imageData.file.type == 'image/jpeg'
    ) {
      // preview file

      const reader = new FileReader();

      reader.onload = () => {
        this.imageData.previewImageUrl = reader.result as string;
      };
      reader.readAsDataURL(this.imageData.file);

      // Update product image name
      this.product!.productImageName = ''; // Clear previous image name

      //upload file
    } else {
      this.toastrService.error('Only JPEG or PNG allowed !');
      this.imageData.file = undefined;
      this.imageData.previewImageUrl = '';
      this.product!.productImageName = '';
    }
  }

  pageChange(page: number) {
    console.log(page);
    if (this.searchMode) {
      this.productSearchService(page - 1);
    } else {
      this.loadProducts(page - 1);
    }
  }

  //SEARCH PRODUCT METHOD
  searchProduct() {
    if (this.searchQuery.trim() == '') {
      // this.toastrService.error('Search Query Required !');
      if (this.oldProductsResponse) {
        this.productsResponse = this.oldProductsResponse;
        this.searchMode = false;
      }
      return;
    }

    // this.searchMode = true;
    this.productSearchService(0);
  }

  productSearchService(
    pageNumber: number = 0,
    pageSize: number = 10,
    sortBy: string = 'title',
    sortDir: string = 'asc'
  ) {
    this.productService
      .searchProduct(this.searchQuery, pageNumber, pageSize, sortBy, sortDir)
      .subscribe({
        next: (data) => {
          if (this.searchMode) {
            this.productsResponse = data;
          } else {
            this.oldProductsResponse = this.productsResponse;
            this.productsResponse = data;
            this.searchMode = true;
          }
        },
      });
  }

  // restore old data
  restoreOldData() {
    if (this.searchQuery.trim() == '' && this.oldProductsResponse) {
      this.productsResponse = this.oldProductsResponse;
      this.oldProductsResponse = undefined;
      this.searchMode = false;
    }
  }

  resetImage() {
    this.imageData.file = undefined;
    this.imageData.previewImageUrl = '';
    this.product!.productImageName = '';
  }

  resetForm(productForm: NgForm) {
    productForm.resetForm();
    this.product = new Product();
  }

  compareFn(value: any, option: any) {
    return value?.categoryId === option?.categoryId;
  }
}
