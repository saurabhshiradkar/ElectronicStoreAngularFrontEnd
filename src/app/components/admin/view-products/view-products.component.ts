import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/category.model';
import { Product, ProductsResponse } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})
export class ViewProductsComponent implements OnInit {

  productsResponse?: ProductsResponse;

  constructor(
    private productService: ProductService,
    private toastrService: ToastrService,

  ) { }
  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (productResponse) => {
        this.productsResponse = productResponse;
        console.log(this.productsResponse);
      }
    })
  }
}


// next: (categories) => {
//   // Update categoryCoverImage for each category
//   this.categories = categories.content.map(category => {
//     if (!category.coverImage.includes('http') && !category.coverImage.startsWith('data')) {
//       category.coverImage = `${environment.apiUrl}/categories/image/${category.categoryId}`;
//     }
//     return category;
//   });
//   this.catStore.dispatch(setCategoryData({ categories: this.categories }))
// }