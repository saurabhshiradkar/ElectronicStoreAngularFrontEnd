import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IInfiniteScrollEvent } from 'ngx-infinite-scroll';
import { Product, ProductsResponse } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-store-categories',
  templateUrl: './store-categories.component.html',
  styleUrls: ['./store-categories.component.css']
})
export class StoreCategoriesComponent {
  categoryId?:string;
  categoryTitle?:string;
  productsResponse ?: ProductsResponse;
  loading = false;
  pageNumber = 0;

  constructor(
    private activatedRoute : ActivatedRoute,
    private titleService : Title,
    private productService : ProductService,
  ){

    this.activatedRoute.paramMap.subscribe((params)=>{
      // console.log(params);
      this.categoryId = params.get('categoryId') as string
      this.categoryTitle = params.get('categoryTitle') as string
      
      console.log(this.categoryId);
      console.log(this.categoryTitle);
      this.titleService.setTitle(this.categoryTitle);
      this.loadCategoryProducts(this.categoryId);
      
    })
  }

  loadCategoryProducts(
    categoryId: string,
    pageNumber = 0,
    pageSize = 10,
    sortBy = 'addedDate',
    sortDir = 'desc'
  ){
    this.loading = true;
    this.productService.getProductsOfCategory(categoryId,pageNumber,pageSize,sortBy,sortDir).subscribe({
      next:(productsResponse)=>{
        if (this.pageNumber==0) {
          this.productsResponse = productsResponse;
          console.log(this.productsResponse);
        }else{
          this.productsResponse = {
            ...productsResponse,
            content:[...(this.productsResponse?.content as Product[]),...productsResponse.content,],
          }
        }
        
        console.log(this.productsResponse);
        this.loading = false;
      },
      error:(error)=>{
        console.log(error);
        this.loading = false;
      }
    })
  }

  productsScrolled(event: IInfiniteScrollEvent) {
    console.log(event);
    if (this.loading || this.productsResponse?.lastPage) {
      return;
    }else{
      console.log('Loading Data from server !');
      
      this.pageNumber +=1
      this.loadCategoryProducts(this.categoryId as string, this.pageNumber);
    }
  }
}
