import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Product,
  ProductWithOutCategory,
  ProductsResponse,
} from '../models/product.model';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.model';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  createProductWithCategory(product: Product) {
    const categoryId = product.category.categoryId;
    return this.http.post<Product>(
      `${environment.apiUrl}/categories/${categoryId}/products`,
      product
    );
  }
  createProduct(product: ProductWithOutCategory) {
    return this.http.post<Product>(`${environment.apiUrl}/products`, product);
  }

  uploadProductImage(productId: string, imageData: File) {
    const formData = new FormData();
    formData.append('image', imageData);
    return this.http.post(
      `${environment.apiUrl}/products/image/${productId}`,
      formData
    );
  }

  getLiveProducts(
    pageNumber = 0,
    pageSize = 10,
    sortBy = 'title',
    sortDir = 'asc'
  ) {
    return this.http.get<ProductsResponse>(
      `${environment.apiUrl}/products/live?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
  }

  getAllProducts(
    pageNumber = 0,
    pageSize = 10,
    sortBy = 'title',
    sortDir = 'asc'
  ) {
    return this.http
      .get<ProductsResponse>(
        `${environment.apiUrl}/products?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
      )
      .pipe(
        map((productResponse: ProductsResponse) =>
          this.updateCategoryAndImageFields(productResponse)
        )
      );
  }

  getProductsOfCategory(
    categoryId: string,
    pageNumber = 0,
    pageSize = 10,
    sortBy = 'title',
    sortDir = 'asc'
  ) {
    return this.http.get<ProductsResponse>(
      `${environment.apiUrl}/categories/${categoryId}/products?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
  }

  public updateCategoryAndImageFields(
    productResponse: ProductsResponse
  ): ProductsResponse {
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
        } else if (
          !product.productImageName.includes('http') ||
          !product.productImageName.startsWith('data')
        ) {
          product.productImageName = `${environment.apiUrl}/products/image/${product.productId}`;
        }
      });
    }

    return productResponse;
  }

  getProductImageUrl(productId: string) {
    return `${environment.apiUrl}/products/image/${productId}`;
  }

  deleteProduct(productId: string) {
    return this.http.delete(`${environment.apiUrl}/products/${productId}`);
  }

  updateProduct(product: Product) {
    return this.http.put<Product>(
      `${environment.apiUrl}/products/${product.productId}`,
      product
    );
  }

  updateCategoryOfProduct(productId: String, categoryId: String) {
    return this.http.put<Product>(
      `${environment.apiUrl}/categories/${categoryId}/products/${productId}`,
      null
    );
  }

  searchProduct(
    query: String,
    pageNumber = 0,
    pageSize = 10,
    sortBy = 'title',
    sortDir = 'asc'
  ) {
    return this.http
      .get<ProductsResponse>(
        `${environment.apiUrl}/products/search/${query}?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
      )
      .pipe(
        map((productResponse: ProductsResponse) =>
          this.updateProductImageUrls(productResponse)
        )
      );
  }

  getProduct(productId: string) {
    return this.http
      .get<Product>(`${environment.apiUrl}/products/${productId}`)
      .pipe(
        map((product: Product) => {
          // if (!product.productImageName || product.productImageName === '') {
          //   // If image name is null or empty, assign default.png
          //   product.productImageName = 'assets/images/default.png';
          // } else if (!product.productImageName.includes('http') || !product.productImageName.startsWith('data')) {
          //   product.productImageName = `${environment.apiUrl}/products/image/${product.productId}`;
          // }

          if (product.category === null) {
            // Assuming that all other fields in the existing category should be retained
            product.category = new Category('', 'No Category', '', '');
          }
          return product;
        })
      );
  }

  public updateProductImageUrls(
    productResponse: ProductsResponse
  ): ProductsResponse {
    // Check if the productResponse and its content are available
    if (productResponse && productResponse.content) {
      productResponse.content.forEach((product: Product) => {
        if (!product.productImageName || product.productImageName === '') {
          // If image name is null or empty, assign default.png
          product.productImageName = 'assets/images/default.png';
        } else if (
          !product.productImageName.includes('http') ||
          !product.productImageName.startsWith('data')
        ) {
          product.productImageName = `${environment.apiUrl}/products/image/${product.productId}`;
        }
      });
    }

    return productResponse;
  }

  getUserImageUrl(product: Product) {
    return `${environment.apiUrl}/users/image/${product.productId}`;
  }
}
