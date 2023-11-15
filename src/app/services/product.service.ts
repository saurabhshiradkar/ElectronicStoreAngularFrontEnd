import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product, ProductsResponse } from '../models/product.model';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.model';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) { }

  createProductWithCategory(product: Product) {
    const categoryId = product.category.categoryId;
    return this.http.post<Product>(`${environment.apiUrl}/categories/${categoryId}/products`, product);
  }
  createProduct(product: Product) {
    return this.http.post<Product>(`${environment.apiUrl}/products`, product);
  }

  uploadProductImage(productId: string, imageData: File) {
    const formData = new FormData()
    formData.append('image', imageData)
    return this.http.post(`${environment.apiUrl}/products/image/${productId}`, formData);
  }

  getLiveProducts(pageNumber = 0, pageSize = 10, sortBy = 'title', sortDir = 'asc') {
    return this.http.get<ProductsResponse>(`${environment.apiUrl}/products/live?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  getAllProducts(pageNumber = 0, pageSize = 10, sortBy = 'title', sortDir = 'asc') {
    return this.http.get<ProductsResponse>(`${environment.apiUrl}/products?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`)
      .pipe(
        map((productResponse: ProductsResponse) => this.updateCategoryAndImageFields(productResponse))
      );
  }


  private updateCategoryAndImageFields(productResponse: ProductsResponse): ProductsResponse {
    // Check if the productResponse and its content are available
    if (productResponse && productResponse.content) {
      productResponse.content.forEach((product: Product) => {
        if (product.category === null) {
          // Assuming that all other fields in the existing category should be retained
          product.category = new Category('', 'No Category', '', '');
        }

        if (!product.productImageName || product.productImageName === '') {
          // If image name is null or empty, assign default.png
          product.productImageName = 'assets/images/default.png';
        } else if (!product.productImageName.includes('http') && !product.productImageName.startsWith('data')) {
          product.productImageName = `${environment.apiUrl}/products/image/${product.productId}`;
        }
      });
    }

    return productResponse;
  }



  // private updateCategoryAndImageFields(productResponse: ProductsResponse): ProductsResponse {
  //   // Check if the productResponse and its content are available
  //   if (productResponse && productResponse.content) {
  //     productResponse.content.forEach((product: Product) => {
  //       if (product.category === null) {
  //         // Assuming that all other fields in the existing category should be retained
  //         product.category = new Category('', 'No Category', '', '');
  //       }
  //       if (productResponse && productResponse.content) {
  //         productResponse.content.forEach((product: Product) => {
  //           if (product.productImageName == null) {
  //             product.productImageName = 'default.png';
  //           } 
  //           else if (!product.productImageName.includes('http') && !product.productImageName.startsWith('data')) {
  //               product.productImageName = `${environment.apiUrl}/products/image/${product.productId}`;
  //             }
  //         });
  //       }
  //     });
  //   }

  //   return productResponse;
  // }

}
